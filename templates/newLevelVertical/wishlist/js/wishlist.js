jQuery(function($) {
    try {
        $.datepicker.regional['ru'] = {
            closeText: 'Закрыть',
            prevText: '&#x3c;Пред',
            nextText: 'След&#x3e;',
            currentText: 'Сегодня',
            monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
                'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
            dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
            dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
            dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            weekHeader: 'Не',
            dateFormat: 'dd.mm.yy',
            firstDay: 1,
            isRTL: false,
            showMonthAfterYear: false,
            yearSuffix: ''
        };
        $.datepicker.setDefaults($.datepicker.regional['ru']);
    } catch (err) {
    }
});
var wishList = {
    itemWL: '.item-WL',
    btnBuy: '.btnBuyWishList',
    countProdsWL: '.countProdsWL',
    genPriceProdsWL: '.genPriceProdsWL',
    frameWL: '[data-rel="list-item"]',
    frameBuy: '.frame-buy-all-products',
    items: [],
    add: function(id, varid) {
        wishList.items = wishList.all();
        var key = id + '_' + varid;
        if (wishList.items.indexOf(key) === -1) {
            wishList.items.push(key);
            localStorage.setItem('wishList', JSON.stringify(wishList.items));
        }
    },
    rm: function(id, varid) {
        wishList.items = wishList.all();
        var key = id + '_' + varid;
        if (wishList.items.indexOf(key) != -1) {
            wishList.items = _.without(wishList.items, key);
            localStorage.setItem('wishList', JSON.stringify(wishList.items));
        }
    },
    all: function() {
        try {
            return JSON.parse(localStorage.getItem('wishList')) ? _.compact(JSON.parse(localStorage.getItem('wishList'))) : []
        } catch (err) {
            return [];
        }
    },
    sync: function() {
        $.post('/wishlist/wishlistApi/sync', function(data) {
            localStorage.setItem('wishList', data);
            $(document).trigger({
                'type': 'wish_list_sync',
                dataObj: data
            });
        })
    }
};
function deleteImage(el) {
    el.parent().remove();
    var img = $('#wishlistphoto img');
    img.attr('src', img.data('src'));
}
function changeDataWishlist(el) {
    $('[data-wishlist-name]').each(function() {
        var $this = $(this);
        $this.html(el.closest('form').find('[name=' + $this.data('wishlistName') + ']').val());
    });
}
function createWishList(el, elS, isajax, data, elSet) {
    if (data) {
        if (data.answer == 'success') {
            location.reload();
        }
    }
}
function validateWishPopup($this, elSetSource) {
    function removeErr() {
        name.next(genObj.msgF).remove();
        $(document).trigger({
            'type': 'imageapi.pastemsg',
            el: drop
        });
        drop.find('[type="submit"]').parent().removeClass('active');
    }
    ;
    var name = $('[name="wishListName"]:last'),
            drop = name.closest('[data-elrun]');

    if (name.val() == "" && drop.find('[data-link]').is(':checked')) {
        removeErr();
        name.after(message.error(text.error.enterName));
        $(document).trigger('hideActivity');
        name.focus();
        $(document).trigger({
            'type': 'imageapi.pastemsg',
            el: drop
        });
        name.unbind('keypress').keypress(function() {
            removeErr();
        });
        $('[data-link]').unbind('change').change(function() {
            removeErr();
        });
        return false;

    }
    else {
        removeErr();
        return true;
    }
}
function reload(el, elS, isajax, data, elSet) {
    if (data) {
        if (data.answer == 'success') {
            location.reload();
        }
    }
}
function addToWL(el, elS, isajax, data, elSet) {
    if (data) {
        if (data.answer == 'success') {
            var btnWish = $('[data-varid="' + el.data('vid') + '"]').find(genObj.btnWish),
                    id = btnWish.parent().data('id'),
                    varid = btnWish.parent().data('varid');
            wishList.add(id, varid);
            processWish();
            wishListCount();
        }
    }
}
function removeItem(el, elS, isajax, data, elSet) {
    if (data) {
        if (data.answer == 'success') {
            var li = el.closest(genObj.parentBtnBuy),
                    infoBut = li.find(genObj.infoBut),
                    id = infoBut.data('id'),
                    varid = infoBut.data('varid');
            li.remove();
            processWishPage();
            wishList.rm(id, varid);
            processWish();
            wishListCount();
        }
    }
}
function removeWL(el, elS, isajax, data, elSet) {
    if (data) {
        if (data.answer == 'success') {
            var frame = el.closest(wishList.frameWL),
                    li = frame.find(genObj.parentBtnBuy);
            li.each(function() {
                var infoBut = $(this).find(genObj.infoBut),
                        id = infoBut.data('id'),
                        varid = infoBut.data('varid');
                wishList.rm(id, varid);
            });
            frame.remove();
            processWish();
            wishListCount();
        }
    }
}
function changeBtnBuyWL(btnBuy, cond) {
    var textEL = btnBuy.find(genObj.textEl);
    if (cond == 'show') {
        btnBuy.parent().removeClass(genObj.btnBuyCss).addClass(genObj.btnCartCss);
        textEL.text(textEL.data('cart'));
    }
    else {
        btnBuy.parent().removeClass(genObj.btnCartCss).addClass(genObj.btnBuyCss);
        if (cond == 'notall') {
            textEL.text(textEL.data('buyOther'));
        }
        else {
            textEL.text(textEL.data('buy'));
        }
    }
}
function processWishPage() {
    $(wishList.frameWL).each(function() {
        var $this = $(this),
                btnBuyLC = 0,
                tempC = 0,
                tempP = 0,
                genSum = 0,
                btnBuyI = $this.find(genObj.btnBuy);
        btnBuyI.each(function() {
            tempC = parseFloat($(this).closest(genObj.parentBtnBuy).find(genObj.plusMinus).val());
            if (isNaN(tempC))
                return false;
            btnBuyLC += tempC;
            tempP = parseFloat($(this).data('price'));
            genSum += tempP * tempC;
        });
        var btnBuyL = btnBuyI.length,
                btnCartL = $this.find('.' + genObj.btnCartCss + ' ' + genObj.btnBuy).length,
                btnBuy = $this.find(wishList.btnBuy),
                genPrice = $this.find(wishList.genPriceProdsWL);
        $this.find(wishList.countProdsWL).text(btnBuyLC);
        $this.find(genObj.plurProd).text(pluralStr(btnBuyLC, plurProd));
        genPrice.text(genSum.toFixed(pricePrecision));
        if (btnBuyLC == 0) {
            $this.find(wishList.frameBuy).hide();
        }
        else {
            $this.find(wishList.frameBuy).show();
            if (btnBuyL == btnCartL) {
                changeBtnBuyWL(btnBuy, 'show');
            }
            else if (btnCartL > 0) {
                changeBtnBuyWL(btnBuy, 'notall');
            }
            else {
                changeBtnBuyWL(btnBuy, 'all');
            }
        }
    });
}
$(document).on('scriptDefer', function() {
    var wishPhoto = $('#wishlistphoto');
    $('.btn-edit-photo-wishlist input[type="file"]').change(function(e) {
        var file = this.files[0],
                img = document.createElement("img"),
                reader = new FileReader();
        reader.onloadend = function() {
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
        wishPhoto.html($(img));
        $(img).load(function() {
            if ($(this).actual('width') > wishPhoto.data('widht') || $(this).actual('height') > wishPhoto.data('height')) {
                $(document).trigger({
                    type: 'drop.successJson',
                    el: $('#notification'),
                    datas: {
                        'answer': true,
                        'data': text.error.fewsize(wishPhoto.data('width') + '&times' + wishPhoto.data('height'))
                    }
                });
                $('[data-drop="#notification"].trigger').data('timeclosemodal', 3000).click();
                $('[data-drop="#notification"].trigger').removeData('timeclosemodal');
                wishPhoto.empty();
                $(this).val('');
                $('[data-wishlist="do_upload"]').attr('disabled', 'disabled').parent().addClass('disabled');
            }
            else {
                $('[data-wishlist="do_upload"]').removeAttr('disabled').parent().removeClass('disabled');
            }
        });
    });
    processWishPage();
    $(wishList.btnBuy).click(function() {
        var $this = $(this),
                btns = $this.closest(wishList.frameWL).find('.' + genObj.btnBuyCss + ' ' + genObj.btnBuy);
        if ($.existsN(btns)) {
            $.fancybox.showActivity();
            btns.each(function() {
                Shop.Cart.add(Shop.Cart.composeCartItem($(this)), false, 'after_add_to_cart_WL');
            });
            var i = 0;
            $(document).on('after_add_to_cart_WL', function(e) {
                i++;
                if (i == btns.length) {
                    togglePopupCart();
                    $(this).off('after_add_to_cart_WL')
                }
            });
        }
        else {
            togglePopupCart();
        }
    });
    $(document).on('after_add_to_cart', function(e) {
        processWishPage();
    });
    $(document).on('processPageEnd change_count_product', function(e) {
        processWishPage();
    });
    $('body').on('click.inWish', '.' + genObj.inWishlist, function() {
        document.location.href = '/wishlist';
    });
    if (!isLogin) {
        $('.' + genObj.toWishlist).on('click.toWish', function(e) {
            $(document).trigger({
                type: 'drop.successJson',
                el: $('#notification'),
                datas: {
                    'answer': true,
                    'data': text.error.notLogin
                }
            });
        });
    }
    else {
        $('.' + genObj.toWishlist).data({
            'always': true,
            'data': {
                "ignoreWrap": true
            }
        });
    }
    if ($.exists("#datepicker"))
        try {
            $("#datepicker").datepicker({
                "dateFormat": "yy-mm-dd",
                changeMonth: true,
                changeYear: true,
                yearRange: "1930:2030"
            });
        } catch (err) {
        }
});