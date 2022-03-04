$(document).ready(function(){
    function update_output() {
        $('#out_txt').val(function() {
            var txt = $('#in_txt').val();
            $('.input-pattern').each(function(){
                var bf = $(this).find('.bf').val();
                if (bf != '') {
                    bf = new RegExp(bf, 'g');
                    var af = $(this).find('.af').val();
                    txt = txt.replace(bf, af);
                }
            });
            return txt;
        });
    }

    function copy_output() {
        $('#out_txt').select();
        navigator.clipboard.writeText($('#out_txt').val());
        $('#copy_alert').show();
        setTimeout(function() {
            // 出力欄からフォーカスを外し、コピーされないようにする
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
                document.activeElement.blur();
            }
            $('#copy_alert').hide();
        }, 1000);
    }

    function add_input_pattern(bf="", af="") {
        var input_field = $(`
        <div class="form-row input-pattern">
        <div class="col-5 d-flex align-items-center">
        <input type="text" class="ptn bf" style="width:100%;" placeholder="変換前">
        </div>
        <div class="col-1 d-flex align-items-center justify-content-center">
        <input type="button" value="&#8660;" class="swap">
        </div>
        <div class="col-5 d-flex align-items-center">
        <input type="text" class="ptn af" style="width:100%;" placeholder="変換後">
        </div>
        <div class="col-1 d-flex align-items-center justify-content-center">
        <input type="button" value="－" class="del">
        </div>
        </div>`);
        input_field.keyup(update_output);
        input_field.find('.bf').val(bf);
        input_field.find('.af').val(af);
        $('#input_pattern_list').append(input_field);
    }

    $(".template-set").on("click", function() {
        // ボタンの ID をキーにして、変換のペアを設定
        var transform_pairs = {
            clear: [["", ""]],
            swap_all: [],
            punctuation: [["，", "、"], ["．", "。"]],
            file: [[" *: *", " "], [" *\\n$", ""], [" *\\n *", " "]]
        };

        $('.input-pattern').each(function(){
            var bf = $(this).find('.bf').val();
            var af = $(this).find('.af').val();
            transform_pairs["swap_all"].push([af, bf]);
        });

        $('.input-pattern').remove();
        transform_pairs[$(this).attr('id')].forEach(function(e) {
            add_input_pattern(e[0], e[1]);
        });
        update_output();
    });

    $("#add").on("click", function() {
        add_input_pattern();
    });

    $(document).on("click", ".swap", function() {
        var input_field = $(this).parent().parent()
        var bf = input_field.find(".bf").val();
        var af = input_field.find(".af").val();
        input_field.find('.bf').val(af);
        input_field.find('.af').val(bf);
        update_output();
    });

    $(document).on("click", ".del", function() {
        if ($('.input-pattern').length > 1) {
            $(this).parent().parent().remove();
            update_output();
        }
    });

    $('#in_txt, .ptn').keyup(update_output);

    $('#out_txt').focus(copy_output).click(copy_output);

    $('#copy').on('click', copy_output);
});