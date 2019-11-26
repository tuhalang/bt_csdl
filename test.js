"use strict"
//====================frontend===========================
let listOfId = ['btn-tbd','btn-tktt','btn-tptkdt','btn-tpthtt','btn-kttkmm'];
let listOfDiv = ['tbd','tktt','tptkdt','tpthtt','kttkmm'];

$('#btn-tbd').click(function(){
    changeBtn(0);
})
$('#btn-tktt').click(function(){
    changeBtn(1);
})
$('#btn-tptkdt').click(function(){
    changeBtn(2);
})
$('#btn-tpthtt').click(function(){
    changeBtn(3);
})
$('#btn-kttkmm').click(function(){
    changeBtn(4);
})

function changeBtn(index){
    for(let i=0; i<listOfId.length; i++){
        $('#'+listOfId[i]).removeClass();
        $('#'+listOfDiv[i]).hide();
        $('#'+listOfId[i]).addClass('btn');
        if(i==index) $('#'+listOfId[i]).addClass('btn-success');
        else $('#'+listOfId[i]).addClass('btn-light');
    }
    $('#'+listOfDiv[index]).show();
}


$('#compute-tbd').click( _ => {
    let txtAttributes = $('#attributes-tbd').val();
    let txtFunctions = $('#functions-tbd').val();
    let init = $('#init-tbd').val();

    const rs = timBaoDong(txtFunctions,init);
    $('#rs-lable').text(rs);
});

$('#compute-tktt').click( _ => {
    let txtAttributes = $('#attributes-tktt').val();
    let txtFunctions = $('#functions-tktt').val();
    
    const rs = timKhoaToiThieu(txtFunctions, txtAttributes);
    $('#rs-lable').text(rs);
});

$('#compute-tptkdt').click( _ => {
    let txtAttributes = $('#attributes-tptkdt').val();
    let txtFunctions = $('#functions-tptkdt').val();
    
    let rs = tapPhuThuocHamKhongDuThua(txtFunctions);
    $('#rs-lable').text(rs);
});

$('#compute-tpthtt').click( _ => {
    let txtAttributes = $('#attributes-tpthtt').val();
    let txtFunctions = $('#functions-tpthtt').val();
        
    let rs = timPhuThuocHamToiThieu(txtFunctions);
    $('#rs-lable').text(rs);
});

$('#compute-kttkmm').click( _ => {
    let txtAttributes = $('#attributes-kttkmm').val();
    let txtRx = $('#rx-kttkmm').val();
    let txtFunctions = $('#functions-kttkmm').val();
        
    let rs = kiemTraTinhMatMat(txtAttributes,txtFunctions,txtRx);
    $('#rs-lable').text(rs);
});
















//======================================================
//=====================================================
function timBaoDong(fs, rs=''){
    fs = fs.split(',');
    fs.sort();
    for(let i=0; i<fs.length; i++){
        fs.forEach(f => {
            const Y = f.split('->')[0];
            const Z = f.split('->')[1];
            if(rs == '')
                rs+=Y+Z;
            else
                if(includes(Y,rs)){
                    for (let i=0; i<Z.length; i++) {
                        if(!rs.includes(Z[i])){
                            rs+=Z[i];
                        }
                    }
                }
        })
    }
    return rs;
}

function includes(e, s){
    for(let i=0; i<e.length; i++){
        if(!s.includes(e[i])) return false;
    }
    return true;
}
//=============================================================

function timKhoaToiThieu(fs,attrs){
    let rs = attrs;
    for(let i=0; i<attrs.length; i++){
        let bd = timBaoDong(fs,rs.replace(attrs[i],''));
        if(bd.length === attrs.length){
            rs = rs.replace(attrs[i],'');
        }
    }
    return rs;
}

//=============================================================
function tapPhuThuocHamTuongDuong(fs1, fs2){
    let _fs1 = fs1.split(',');
    for(let i=0; i<_fs1.length; i++){
        let Y = _fs1[i].split('->')[0];
        let Z = _fs1[i].split('->')[1];
        let bd = timBaoDong(fs2,Y);
        let check = includes(Z, bd);
        if(!check) return false;
    }

    let _fs2 = fs2.split(',');
    for(let i=0; i<_fs2.length; i++){
        let Y = _fs2[i].split('->')[0];
        let Z = _fs2[i].split('->')[1];
        let bd = timBaoDong(fs1,Y);
        if(!includes(Z, bd)) return false;
    }

    return true;
}

//=======================================================
function tapPhuThuocHamKhongDuThua(fs){
    let _fs = fs.split(',');
    let rs = _fs;
    for(let i=0; i<_fs.length; i++){
        if(tapPhuThuocHamTuongDuong(rs.join(','),remove(rs,i).join(','))){
            rs.splice(i,1);
        }
    }
    return rs;
}

function remove(arr, i){
    let arr1 = [];
    for(let j=0; j<arr.length; j++){
        if(j!=i) arr1.push(arr[j]);
    }
    return arr1;
}

//===============================================================
function timPhuThuocHamToiThieu(fs){
    //Convert F to F1
    let f1=[];
    let f2=[];
    fs = fs.split(',');
    fs.forEach(f => {
        let Y = f.split('->')[0];
        let Z = f.split('->')[1];
        for(let i=0; i<Z.length; i++){
            if(Y.length==1)
                f1.push(Y+'->'+Z[i]);
            else
                f2.push(Y+'->'+Z[i]);
        }
    });

    //filter attribute
    for(let i=0; i<f2.length; i++){
        let fi = f2[i];
        let Y = f2[i].split('->')[0];
        let Z = f2[i].split('->')[1];
        let rm = [];
        for(let j=0; j<Y.length; j++){
            f2[i] = removeS(Y,[j])+'->'+Z;
            let bd = timBaoDong(f1.concat(remove(f2,i)).join(','),removeS(Y,[j]));
            if(bd.includes(Z)){
                rm.push(j);
            }
            f2[i] = fi;
        }
        Y=removeS(Y,rm);
        if(Y=='') Z='';
        f2[i] = Y+'->'+Z;
    }
    let s = new Set(f1.concat(f2));
    
    //Remove
    return tapPhuThuocHamKhongDuThua(Array.from(s).join(','));
}

function removeS(s, arr){
    let s1 = '';
    for(let i=0; i<s.length; i++){
        if(!arr.includes(i)) s1+=s[i];
    }
    return s1;
}


//=====================================================
function kiemTraTinhMatMat(r, fs, rx){
    let table = []
    rx=rx.split(',');
    for(let i=0; i<rx.length; i++){
        let row = [];
        for(let j=0; j<r.length; j++){
            if(rx[i].includes(r[j])){
                row.push(true);
            }else{
                row.push(false);
            }
        }
        table.push(row);
    }
    fs = fs.split(',')
    for(let h=0; h<fs.length; h++){
        for(let i=0; i<fs.length; i++){
            let Y = fs[i].split('->')[0];
            let Z = fs[i].split('->')[1];
            let indexY = index(Y,r);
            let tmp = [];
            for(let j=0; j<rx.length-1; j++){
                for(let k=1; k<rx.length; k++){
                    if(checkEqual(table[j],table[k],indexY)){
                        tmp.push(j);
                        tmp.push(k);
    
                        let indexZ = index(Z,r);
                        for(let j=0; j<indexZ.length; j++){
                            let rs=false;
                            for(let k=0; k<rx.length; k++){
                                if(tmp.includes(k)) rs = rs || table[k][indexZ[j]];
                            }
                            for(let k=0; k<rx.length; k++){
                                if(tmp.includes(k)) table[k][indexZ[j]]=rs;
                            }
                        }
                        tmp = [];
                    }
                }
            }
    }
    
    }
    for(let i=0; i<rx.length; i++){
        if(checkTrue(table[i])) return true;
    }
    return false;
}

function index(e, s){
    let rs=[];
    let i = s.indexOf(e);
    for(let j=0; j<e.length;j++){
        rs.push(i+j);
    }
    return rs;
}

function checkEqual(arr1, arr2, index){
    for(let i=0; i<index.length; i++){
        if(arr1[index[i]] != arr2[index[i]]) return false;
    }
    return true;
}

function checkTrue(arr){
    for(let i=0; i<arr.length; i++){
        if(!arr[i]) return false;
    }
    return true;
}

console.log(timBaoDong('A->B,C->D,B->C',''));
console.log(timKhoaToiThieu('AB->C,AC->B,BC->DE','ABCDE'));
console.log(tapPhuThuocHamKhongDuThua('A->B,A->C,B->C,AB->C'));
console.log(timPhuThuocHamToiThieu('A->B,ABCD->E,EF->G,ACDF->EG'));
console.log(kiemTraTinhMatMat('ABCD','A->C,B->C,CD->B,C->D','AB,BD,ABC,BCD'))