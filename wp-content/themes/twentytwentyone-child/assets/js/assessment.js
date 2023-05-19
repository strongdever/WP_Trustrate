$(function() {
    // ページ読み込み時に発火させる関数
    $('.contactForm__item input:not([name*=InputUnit]), .contactForm__item textarea, .contactForm__item select, .multiStoreSelect__box select').each(function() {
        var selector = $(this);

        // 必須項目の背景色変更
        changeColor(selector, isValid(selector));

        // 物件所在地があれば「ご住所」の入力欄を非表示（査定物件と同じか否かのラジオボタンを表示）
        if (document.getElementById('baikyaku_zipCode')) {
            $('.user_addressWrapper').addClass('hidden');
        }
        // フォームIDを取得
        var selectorId = selector.attr('id');
        // 生年月日の時は、全ての項目が埋まったらアイコン変える
        if (selectorId === 'birthdayYear' || selectorId === 'birthdayMonth' || selectorId === 'birthdayDay') {
            changeBirthday();
        } else if (selectorId === 'sameOrDifferentAddress-1' || selectorId === 'sameOrDifferentAddress-2'
            || selectorId === 'zipCode' || selectorId === 'addressCode1' || selectorId === 'addressStr2' || selectorId === 'addressStr3' || selectorId === 'addressStr4') {
            //ご住所の時は、番地まで埋まったらアイコン変える
            changeAddress();
        } else if (selectorId === 'baikyaku_zipCode' || selectorId === 'baikyaku_addressCode1' || selectorId === 'baikyaku_addressStr2' || selectorId === 'baikyaku_addressStr3' || selectorId === 'baikyaku_addressStr4') {
            // 物件所在地
            changeBknAddress();
        } else if (selectorId === 'bknClass-b1' || selectorId === 'bknClass-b2' || selectorId === 'bknClass-b3' || selectorId === 'bknClass-oth' || selectorId === 'otherClass') {
            changeBknClass();
        } else if (selectorId === 'floorMax' || selectorId === 'floorNum' || selectorId === 'balconyDcnCode' || selectorId === 'senyuArea' || selectorId === 'tochiArea' || selectorId === 'shidoArea' || selectorId === 'tatemonoArea' || selectorId === 'madori' || selectorId === 'madorizuFlg-1' || selectorId === 'parkingFlg-1' || selectorId === 'cornerFlg-1') {
            changeBknDetail();
        } else {
            changeIcon(selector, isValid(selector));
        }

        countAction();
        setButton();
    });

    // 郵便番号から住所判定
    $('#zipCode, #baikyaku_zipCode').on('input', function() {
        var inputNum = $(this).val();
        // ご住所か物件所在地かを判定するためにフォームIDを取得(zipCode : ご住所, baikyaku_zipCode : 物件所在地)
        var formId   = $(this).attr('id');

        //ハイフン削除
        inputNum = inputNum.replace(/[━.*‐.*―.*－.*\–.*ー.*\-]/gi, '');
        //大文字を小文字に変換
        inputNum = inputNum.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
        // 数字7桁の判定
        if (inputNum.length == '7' && inputNum.match(/^[0-9]+$/)) {
            // 住所取得
            $.ajax({
                type    : 'POST',
                url     : '/common/ajax/getaddress/',
                data    : 'zipCode=' + inputNum,
                handleAs: 'json',
                success : function(re) {
                    var data = JSON.parse(re);
                    if (data !== false) {
                        // DBのcode1は01~09でview側のcode1は1~9なので先頭が0だったら削除する
                        var code1     = data['code1'];
                        var leadCode1 = code1.slice(0, 1);
                        if (leadCode1 === '0') {
                            code1 = code1.substr(1);
                        }

                        var baikyaku = '';
                        if (formId === 'baikyaku_zipCode') {
                            baikyaku = 'baikyaku_';
                        }
                        // 郵便番号の背景色を変更
                        changeColor($('input#' + baikyaku + 'zipCode'), true);
                        // 都道府県を挿入
                        $('select#' + baikyaku + 'addressCode1').val(code1);
                        // 都道府県のエラーを非表示にする
                        if ($('.' + baikyaku + 'addressCode1formError')) {
                            $('.' + baikyaku + 'addressCode1formError').hide();
                        }
                        // 背景色を変更
                        changeColor($('select#' + baikyaku + 'addressCode1'), true);

                        // 市区町村を挿入
                        $('input#' + baikyaku + 'addressStr2').val(data['str2'] + data['str3']);
                        changeColor($('input#' + baikyaku + 'addressStr2'), true);
                        // 市区町村のエラーを非表示にする
                        if ($('.' + baikyaku + 'addressStr2formError')) {
                            $('.' + baikyaku + 'addressStr2formError').hide();
                        }
                    }
                }
            });
        }
    });
});

/**
 * ValidationEngineのonFieldSuccess、onFieldFailureのコールバック
 * @param {*} field
 * @param {*} isValid
 */
function onInputValue(field, isValid) {
    if (!field) {
        return;
    }

    // 背景色の変更
    changeColor(field, isValid);

    // フォームIDを取得
    var selectorId = field.attr('id');

    // 生年月日の時は、全ての項目が埋まったらアイコン変える
    if (selectorId === 'birthdayYear' || selectorId === 'birthdayMonth' || selectorId === 'birthdayDay') {
        changeBirthday();
    } else if (selectorId === 'sameOrDifferentAddress-1' || selectorId === 'sameOrDifferentAddress-2'
        || selectorId === 'zipCode' || selectorId === 'addressCode1' || selectorId === 'addressStr2' || selectorId === 'addressStr3' || selectorId === 'addressStr4') {
        // ご住所
        changeAddress();
    } else if (selectorId === 'baikyaku_zipCode' || selectorId === 'baikyaku_addressCode1' || selectorId === 'baikyaku_addressStr2' || selectorId === 'baikyaku_addressStr3' || selectorId === 'baikyaku_addressStr4') {
        // 物件所在地
        changeBknAddress();
    } else if (selectorId === 'bknClass-b1' || selectorId === 'bknClass-b2' || selectorId === 'bknClass-b3' || selectorId === 'bknClass-oth' || selectorId === 'otherClass') {
        // 物件種別
        changeBknClass();
    } else if (selectorId === 'floorMax' || selectorId === 'floorNum' || selectorId === 'balconyDcnCode' || selectorId === 'senyuArea' || selectorId === 'tochiArea' || selectorId === 'shidoArea' || selectorId === 'tatemonoArea' || selectorId === 'madori' || selectorId === 'madorizuFlg-1' || selectorId === 'parkingFlg-1' || selectorId === 'cornerFlg-1') {
        // 物件種別
        changeBknDetail();
    } else {
        changeIcon(field, isValid);
    }

    countAction();
    setButton();
}

// 生年月日は全て埋まればアイコンを変化
function changeBirthday() {
    var year  = $('#birthdayYear').val();
    var month = $('#birthdayMonth').val();
    var day   = $('#birthdayDay').val();
    if (year !== '' && month !== '' && day !== '') {
        changeIcon($('#birthdayYear'), true);
    } else {
        changeIcon($('#birthdayYear'), false);
    }
}

// 住所系は「番地」まで埋まればアイコンを変化
function changeAddress() {
    // 1:査定物件と同じ / 2:査定物件とは異なる
    var sameOrDifference = $('input:radio[name="sameOrDifferentAddress"]:checked').val();

    var baikyaku = '';
    if (sameOrDifference === '1') {
        baikyaku = 'baikyaku_';
    }

    var zipCode      = $('#' + baikyaku + 'zipCode').val();
    var addressCode1 = $('#' + baikyaku + 'addressCode1').val();
    var addressStr2  = $('#' + baikyaku + 'addressStr2').val();
    var addressStr3  = $('#' + baikyaku + 'addressStr3').val();
    var addressStr4  = $('#' + baikyaku + 'addressStr4').val();

    // 査定物件とは異なる場合
    if (sameOrDifference === '2') {
        // ラジオボタン直下に余白を作る
        $('.same_different_address').css('margin-bottom', '20px');
        // 入力フォームを表示
        $('.user_addressWrapper').removeClass('hidden');
        // 「ご住所」の値が番地まで埋まっていたら
        if (zipCode !== '' && addressCode1 !== '' && addressStr2 !== '' && addressStr3 !== '') {
            changeIcon($('#zipCode'), true);
        } else {
            changeIcon($('#zipCode'), false);
        }
    } else if (sameOrDifference === '1') {
        // 査定物件と同じ場合
        // 入力フォームを非表示
        $('.user_addressWrapper').addClass('hidden');
        // 物件所在地と同じ内容を挿入
        $('#zipCode').val(zipCode);
        $('#addressCode1').val(addressCode1);
        $('#addressStr2').val(addressStr2);
        $('#addressStr3').val(addressStr3);
        $('#addressStr4').val(addressStr4);
        changeIcon($('#sameOrDifferentAddress-1'), true);
    } else {
        if (zipCode !== '' && addressCode1 !== '' && addressStr2 !== '' && addressStr3 !== '') {
            changeIcon($('#zipCode'), true);
        } else {
            changeIcon($('#zipCode'), false);
        }
    }
}

// 物件所在地は「番地」まで埋まればアイコンを変化
function changeBknAddress() {

    // 入力されている値を取得
    var zipCode      = $('#baikyaku_zipCode').val();
    var addressCode1 = $('#baikyaku_addressCode1').val();
    var addressStr2  = $('#baikyaku_addressStr2').val();
    var addressStr3  = $('#baikyaku_addressStr3').val();
    var addressStr4  = $('#baikyaku_addressStr4').val();

    // 物件種別を取得
    var bknClass = $('input[name="bknClass"]:checked').val();

    // 種別がマンションの時は、「建物名 / 部屋番号」が埋まったらアイコン変化
    if (bknClass === 'b1' && zipCode !== '' && addressCode1 !== '' && addressStr2 !== '' && addressStr3 !== '' && addressStr4 !== '') {
        changeIcon($('#baikyaku_zipCode'), true);
    } else if (bknClass !== 'b1' && zipCode !== '' && addressCode1 !== '' && addressStr2 !== '' && addressStr3 !== '') {
        changeIcon($('#baikyaku_zipCode'), true);
    } else {
        changeIcon($('#baikyaku_zipCode'), false);
    }
}

// 物件種別
function changeBknClass() {

    // 物件種別を取得
    var bknClass = $('input[name="bknClass"]:checked').val();

    var inputForm = document.getElementById('bknClass-' + bknClass);

    // その他種別を取得
    var otherClass = $('input#otherClass').val();
    // その他種別のとき
    if (bknClass === 'oth') {
        // その他種別フォームを表示
        $('.otherbkn_class').removeClass('hidden');
        // 建物名 / 部屋番号を非表示
        $('.tatemonoName_roomNum').addClass('hidden');
        // どちらも埋まっていたらアイコンを変える
        if (bknClass !== '' && otherClass !== '') {
            changeIcon($(inputForm), true);
        } else {
            // どちらか一方が埋まっていなかったら背景色を赤にする
            changeColor($('input#otherClass'), false);
            // どちらか一方が埋まっていなかったらアイコン変えない
            changeIcon($(inputForm), false);
        }
    } else {
        // 選択した種別が「マンション」でないとき
        if (bknClass !== 'b1') {
            // 建物名 / 部屋番号を非表示
            $('.tatemonoName_roomNum').addClass('hidden');
        } else {
            // 建物名 / 部屋番号を表示
            $('.tatemonoName_roomNum').removeClass('hidden');
            changeColor($('#baikyaku_addressStr4'), isValid($('#baikyaku_addressStr4')));
        }
        // その他種別フォームを非表示にして値をリセット
        $('.otherbkn_class').addClass('hidden');
        $('input#otherClass').val('');
        // その他種別以外のとき、項目が埋まればアイコンを変化
        changeIcon($(inputForm), isValid($(inputForm)));
    }

    // 物件所在地
    changeBknAddress();
    // 物件詳細が設定されていたら
    var bknDetail = document.getElementById('bknDetail');
    if (bknDetail) {
        changeBknDetailItems(bknClass);
    }
}

// 物件詳細
function changeBknDetailItems(bknClass) {

    // 一旦、全項目表示
    $('.contactForm__bkndetail').find('li').each(function() {
        $(this).removeClass('hidden');
    });

    // 種別によって項目を出しわけする
    if (bknClass === 'b1') {
        $('li.tochiArea').addClass('hidden');// 土地面積
        $('li.shidoArea').addClass('hidden');// 私道面積
        $('li.madorizuFlg').addClass('hidden');// 間取り図有
        $('li.parkingFlg').addClass('hidden');// 駐車場有
        // マンションの時
    } else if (bknClass === 'b2') {
        // 戸建ての時
        $('li.floorNum').addClass('hidden');// 所在階
        $('li.cornerFlg').addClass('hidden');// 角部屋
        $('li.senyuArea').addClass('hidden');// 専有面積
        $('li.shidoArea').addClass('hidden');// 私道面積
    } else if (bknClass === 'b3') {
        // 土地
        $('li.floorMax').addClass('hidden');// 総階数
        $('li.floorNum').addClass('hidden');// 所在階
        $('li.balconyDcnCode').addClass('hidden');// 向き
        $('li.senyuArea').addClass('hidden');// 専有面積
        $('li.madori').addClass('hidden');// 間取り
        $('li.madorizuFlg').addClass('hidden');// 間取図有
        $('li.parkingFlg').addClass('hidden');// 駐車場有
        $('li.cornerFlg').addClass('hidden');// 角部屋
        $('li.tatemonoArea').addClass('hidden');// 建物面積
    } else if (bknClass === 'oth') {
        // その他
        $('li.floorMax').addClass('hidden');// 総階数
        $('li.floorNum').addClass('hidden');// 所在階
        $('li.balconyDcnCode').addClass('hidden');// 向き
        $('li.shidoArea').addClass('hidden');// 私道面積
        $('li.madori').addClass('hidden');// 間取り
        $('li.madorizuFlg').addClass('hidden');// 間取り図有
        $('li.parkingFlg').addClass('hidden');// 駐車場有
        $('li.cornerFlg').addClass('hidden');// 角部屋
    }
    changeBknDetail();
}

function changeBknDetail() {
    // 物件種別を取得
    var bknClass = $('input[name="bknClass"]:checked').val();

    // 必須項目が全て埋まっていればOKにする
    var requiredBknDetail = true;
    $('.contactForm__bknDetail .requires').each(function(i, element) {
        if (!isValid($(element))) {
            requiredBknDetail = false;
            return false;
        }
    });
    if (bknClass === 'b2') {
        icon = $('input#floorMax').parents('td').prev('th').find('.requiredmark');
    } else if (bknClass === 'b3') {
        icon = $('input#tochiArea').parents('td').prev('th').find('.requiredmark');
    } else if (bknClass === 'oth') {
        icon = $('input#senyuArea').parents('td').prev('th').find('.requiredmark');
    } else {
        icon = $('input#floorMax').parents('td').prev('th').find('.requiredmark');
    }
    if (requiredBknDetail) {
        icon.css('background-color', 'rgb(86, 175, 109)').text('OK');
        icon.addClass('requiredOk');
    } else {
        icon.css('background-color', 'rgb(240, 39, 39)').text('必須');
        icon.removeClass('requiredOk');
    }
    var optionalBknDetail = true;
    $('.contactForm__bknDetail select, .contactForm__bknDetail input[type="text"]').each(function(i, element) {
        if (isEmpty($(element))) {
            optionalBknDetail = false;
        }
    });
    if (bknClass === 'b2') {
        icon = $('input#floorMax').parents('td').prev('th').find('.optionalmark');
    } else if (bknClass === 'b3') {
        icon = $('input#tochiArea').parents('td').prev('th').find('.optionalmark');
    } else if (bknClass === 'oth') {
        icon = $('input#senyuArea').parents('td').prev('th').find('.optionalmark');
    } else {
        icon = $('input#floorMax').parents('td').prev('th').find('.optionalmark');
    }
    if (optionalBknDetail) {
        icon.css('background-color', 'rgb(86, 175, 109)').text('OK');
    } else {
        icon.css('background-color', 'rgb(121, 178, 217)').text('任意');
    }
}

/**
 * 必須項目の背景色変更
 * @param {*} selector インプットのセレクタ
 * @param {boolean} isValid バリデートの結果
 */
function changeColor(selector, isValid) {
    required = isRequired(selector);
    if (!required) {
        return;
    } // 必須じゃなかったら変える必要ない

    // チェックボックスの場合、ラベルの色を変える
    if (selector.prop('type') === 'checkbox' || selector.prop('type') === 'radio') {
        var label = selector.closest('td').find('label');
        if (isValid) {
            label.css('background-color', '#fff');
        } else {
            label.css('background-color', 'rgb(255, 233, 228)');
        }
    } else {
        // テキスト、セレクトボックスの場合
        if (isValid) {
            selector.css('background-color', '#fff');
        } else {
            selector.css('background-color', 'rgb(255, 233, 228)');
        }
    }
}

/**
 * 必須、任意、OKのアイコンの切り替え
 * @param {*} selector
 * @param {boolean} isValid
 */
function changeIcon(selector, isValid) {

    var icon = '';
    // 多店舗選択の必須アイコン
    if (selector.attr('name') === 'companyId') {
        icon = selector.parents('.multiStoreSelect').find('span.requiredmark');
    } else {
        icon = selector.parents('td').prev('th').find('.requiredmark , .optionalmark');
    }

    if (isRequired(selector)) {
        if (isValid) {
            icon.css('background-color', 'rgb(86, 175, 109)').text('OK');
            icon.addClass('requiredOk');
        } else {
            icon.css('background-color', 'rgb(240, 39, 39)').text('必須');
            icon.removeClass('requiredOk');
        }
    } else {
        if (!isEmpty(selector) && isValid) {
            icon.css('background-color', 'rgb(86, 175, 109)').text('OK');
        } else {
            icon.css('background-color', 'rgb(121, 178, 217)').text('任意');
        }
    }
}

function isValid(selector) {
    if (!isRequired(selector)) {
        return true;
    }

    return !isEmpty(selector);
}

/**
 * validateクラスから必須かどうかを判断する
 * @param {*} selector inputのセレクタ
 */
function isRequired(selector) {
    if (!selector.attr('class')) {
        return false;
    }

    if (selector.parent().hasClass('hidden')) {
        return false;
    }

    var validators = selector.attr('class').match(/validate\[(.*)\]/);
    validators     = validators.length > 1 && validators[1];

    if (!validators) {
        return false;
    }

    return validators.split(', ').indexOf('required') !== -1;
}

/**
 * 入力項目が空欄になっているか
 * @param {*} selector
 */
function isEmpty(selector) {
    if (selector.prop('type') === 'checkbox' || selector.prop('type') === 'radio') {
        return !$('input[name=\'' + selector.attr('name') + '\']').is(':checked');
    } else {
        return selector.val() === '';
    }
}

// 「x/y」のテキスト部分を挿入
function countAction() {
    var allRequiredCnt   = $('.requiredmark').length;
    var inputRequiredCnt = $('.requiredOk').length;
    // 必須項目の総数表示
    $('.numerator').text(allRequiredCnt);
    // 入力済み必須項目数表示
    $('.denominator').text(inputRequiredCnt);
}

// カウンター表示・非表示 / ボタンの表示・非表示
function setButton() {
    var allRequiredCnt   = $('.requiredmark').length;
    var inputRequiredCnt = $('.requiredOk').length;

    // 必須項目が全て入力されたとき
    if (inputRequiredCnt >= allRequiredCnt) {
        // 「x/y 必須項目完了」を非表示
        $('.submit_no').css('display', 'none');
        // 「未入力項目があります」ボタンを非表示
        $('#noSubmit').css('display', 'none');
        // 「確認画面へお進みください」を表示
        $('.submit_ok').css('display', 'table-cell');
        // 「確認画面へ」ボタンを表示
        $('#submit').css('display', 'flex');
    } else {
        // 「x/y 必須項目完了」を表示
        $('.submit_no').css('display', 'block');
        // 「未入力項目があります」ボタンを表示
        $('#noSubmit').css('display', 'flex');
        // 「確認画面へお進みください」を非表示
        $('.submit_ok').css('display', 'none');
        // 「確認画面へ」ボタンを非表示
        $('#submit').css('display', 'none');
    }
}