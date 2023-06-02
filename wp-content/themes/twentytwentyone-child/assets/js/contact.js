$(function() {
    // ページ読み込み時に発火させる関数
    $('.contactForm__item input , .contactForm__item textarea , .contactForm__item select, .multiStoreSelect__box select').each(function() {
        var selector = $(this);
        // 必須項目の背景色変更
        changeColor(selector, isValid(selector));

        // フォームIDを取得
        var selectorId = selector.attr('id');
        // 生年月日の時は、全ての項目が埋まったらアイコン変える
        if (selectorId === 'birthdayYear' || selectorId === 'birthdayMonth' || selectorId === 'birthdayDay') {
            changeBirthday();
        } else if (selectorId === 'zipCode' || selectorId === 'addressCode1' || selectorId === 'addressStr2' || selectorId === 'addressStr3' || selectorId === 'addressStr4') {
            //ご住所の時は、番地まで埋まったらアイコン変える
            changeAddress();
        } else {
            changeIcon(selector, isValid(selector));
        }
        countAction();
        setButton();
    });

    // 郵便番号から住所判定
    $('#zipCode').on('input', function() {
        var inputNum = $(this).val();
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
                type: 'POST',
                url: '/common/ajax/getaddress/',
                data: 'zipCode=' + inputNum,
                handleAs: 'json',
                success: function(re) {
                    var data = JSON.parse(re);
                    if (data !== false) {
                        // DBのcode1は01~09でview側のcode1は1~9なので先頭が0だったら削除する
                        var code1 = data['code1'];
                        var leadCode1 = code1.slice(0, 1);
                        if (leadCode1 === '0') {
                            code1 = code1.substr(1);
                        }

                        // 郵便番号の背景色を変更
                        changeColor($('input#zipCode'), true);
                        // 都道府県を挿入
                        $('select#addressCode1').val(code1);
                        // 都道府県のエラーを非表示にする
                        if ($('.addressCode1formError')) {
                            $('.addressCode1formError').hide();
                        }
                        // 背景色を変更
                        changeColor($('select#addressCode1'), true);

                        // 市区町村を挿入
                        $('input#addressStr2').val(data['str2'] + data['str3']);
                        changeColor($('input#addressStr2'), true);
                        // 市区町村のエラーを非表示にする
                        if ($('.addressStr2formError')) {
                            $('.addressStr2formError').hide();
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

    var selectorId = field.attr('id');
    if (selectorId === 'birthdayYear' || selectorId === 'birthdayMonth' || selectorId === 'birthdayDay') {
        changeBirthday();
    } else if (selectorId === 'zipCode' || selectorId === 'addressCode1' || selectorId === 'addressStr2' || selectorId === 'addressStr3' || selectorId === 'addressStr4') {
        changeAddress();
    } else {
        changeIcon(field, isValid);
    }

    // 背景色の変更
    changeColor(field, isValid);
    countAction();
    setButton();
}

// 生年月日は全て埋まればアイコンを変化
function changeBirthday() {
    var year = $('#birthdayYear').val();
    var month = $('#birthdayMonth').val();
    var day = $('#birthdayDay').val();
    if (year !== '' && month !== '' && day !== '') {
        changeIcon($('#birthdayYear'), true);
    } else {
        changeIcon($('#birthdayYear'), false);
    }
}

// 生年月日は全て埋まればアイコンを変化
function changeAddress() {
    var zipCode = $('#zipCode').val();
    var addressCode1 = $('#addressCode1').val();
    var addressStr2 = $('#addressStr2').val();
    var addressStr3 = $('#addressStr3').val();
    if (zipCode !== '' && addressCode1 !== '' && addressStr2 !== '' && addressStr3 !== '') {
        changeIcon($('#zipCode'), true);
    } else {
        changeIcon($('#zipCode'), false);
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

    var validators = selector.attr('class').match(/validate\[(.*)\]/);
    validators = validators.length > 1 && validators[1];
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
    var allRequiredCnt = $('.requiredmark').length;
    var inputRequiredCnt = $('.requiredOk').length;
    // 必須項目の総数表示
    $('.numerator').text(allRequiredCnt);
    // 入力済み必須項目数表示
    $('.denominator').text(inputRequiredCnt);
}

// カウンター表示・非表示 / ボタンの表示・非表示
function setButton() {
    var allRequiredCnt = $('.requiredmark').length;
    var inputRequiredCnt = $('.requiredOk').length;

    // 必須項目が全て入力されたとき
    if (inputRequiredCnt === allRequiredCnt) {
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