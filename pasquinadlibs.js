$(document).ready(function() {

    var templateRegex = /\[([^\]]+)\]/g;

    $('[data-pasquinadlibs]').each(function() {
        pasquinadlib(this);
    });

    function pasquinadlib(el) {
        var filename = $(el).data('pasquinadlibs');
        $.get(filename, function(template) {

            var stepsEl = $('<ul class="step-steps"></ul>');
            var panesEl = $('<div class="step-content"></div>');

            var prompts = parsePrompts(template);
            prompts.forEach(function(prompt, num) {
                var stepId = 'step' + (num + 1);
                var wordType = prompt.slice(1, -1);

                $(stepsEl).append(`
                    <li data-step-target="${stepId}">${num + 1}</li>
                `);
                $(panesEl).append(`
                    <div class="step-tab-panel" data-step="${stepId}">
                        <label for="input-${stepId}">${wordType}: </label>
                        <input id="input-${stepId}" />
                    </div>
                `);
            });

            $(el).append(stepsEl);
            $(el).append(panesEl);
            $(el).append(`
                <div class="step-footer">
                    <button data-step-action="prev" class="step-btn">Previous</button>
                    <button data-step-action="next" class="step-btn">Next</button>
                    <button data-step-action="finish" class="step-btn">Finish</button>
                </div>
            `);

            $(el).addClass('step-app').steps({
                onInit: function() {
                    var steps = this;
                    $(this).find('input').keyup(function(event) {
                        if (event.key === "Enter") {
                            $(steps).data('plugin_Steps').next();
                            $(this).parent().next().find('input').focus();
                        }
                    });
                },
                onFinish: function () {
                    var answers = $(el).find('input').map(function() { return $(this).val() }).get();
                    var answerIndex = 0;
                    var finished = template.replace(templateRegex, function() {
                        return answers[answerIndex++];
                        
                    });
                    $('#pasquinadlibs-results').html(`
                        <p>${finished}</p>
                        <button id="resetPasquinadlibs">Try again</button>
                    `);

                    var steps = this;
                    $('#resetPasquinadlibs').click(function() {
                        $(steps).find('input').val('');
                        $(steps).data('plugin_Steps').setStepIndex(0);
                        $(steps).find('input').first().focus();
                        $('#pasquinadlibs-results').html('');
                    });
                },
            });

        });
    }

    function parsePrompts(template) {
        return template.match(templateRegex);
    }

});
