AJS.toInit(function ($) {

    /**
     * Get the pageId given the page name.
     * 
     * @param form
     *            the form
     * @return id
     */
    var getPageId = function ($form) {
        // Example pageNameWithSpace: The Page Name (Some Space Key)
        var pageNameWithSpace = $form.find(
                "input[name='pageToAddLabelsTo']").val();

        var pageName = $.trim(pageNameWithSpace.substr(0,
                    pageNameWithSpace.indexOf('(')));
        var spaceKey = $.trim(pageNameWithSpace.substr(
                pageNameWithSpace.indexOf('(') + 1, pageNameWithSpace
                        .lastIndexOf(')')
                        - (pageNameWithSpace.indexOf('(') + 1)));
        
        if (!spaceKey || 0 === spaceKey.length) {
            $form.find(".pagela-note").text(AJS.I18n.getText("pagela.macro.error.getPageId.message", "No spaceKey given - was an item selected from the list?")).show()
            .fadeOut(5000);
            // don't execute an actual ajax call if the spaceKey is faulty
            return AJS.$.ajax();
            
        } else {
            console.log("Pagela: getPageId called with " + pageNameWithSpace + ": " + pageName + ", " + spaceKey);
            
            var quote = "'";
            if (pageName.includes("'")) {
                quote = "\"";
            }
            
            return AJS.$
                    .ajax({
                        type : "GET",
                        myForm : $form, // pass $form further down to the
                                        // done call
                        url : AJS.params.contextPath
                                + "/rest/api/content/search?cql=type=page+and+title="
                                + quote + pageName + quote + "+and+space="
                                + spaceKey,
                        async : true,
                        dataType : "json"
                    });
        }
    }

    /**
     * Add given label to a page given its id.
     * 
     * @param pageId
     *            the id of the page to which to add the label to
     * @param labelString
     *            the label as a String to add to the page
     */
    var addLabel = function (pageId, labelString) {
        console.log("Pagela: addLabel called with " + pageId + ", " + labelString);

        // this action requires a security token via safe wrapper to ajax
        return AJS.safe.ajax({
            type : "POST",
            url : AJS.params.contextPath + "/json/addlabelactivity.action",
            data : {
                entityIdString : pageId,
                labelString : labelString
            },
            async : true,
            dataType : "json"
        });
    };

    /**
     * Add all selected labels to a page given its id.
     * 
     * @param form
     *            the form
     * @param pageId
     *            the id of the page to which to add the labels to
     */
    var addLabelsToPage = function ($form, pageId) {
        console.log("Pagela: addLabelsToPage called with " + pageId);
        
        var pageAltName = $form.find("input[name='pageAltName']").val();

        if (typeof pageId === "undefined") {
            $form.find(".pagela-note").text(
                    AJS.I18n.getText("pagela.macro.error.pageUnknown.message",
                            pageAltName)).show().fadeOut(5000);
            return false;
        }

        $form.find(".pagela-select option:selected").each(function () {
            // # $(this).val() returns the selected option
            addLabel(pageId, $(this).val())
              .done(function (response) {
                // console.log(response)
                
                $form.find(".pagela-note").text(
                        AJS.I18n.getText("pagela.macro.success.message")).show()
                        .fadeOut(5000);
                
            }).fail(function (xhr, status, error) {
                var err = JSON.parse(xhr.responseText);
                var errorMessage = err.statusCode + ": " + err.reason;
                // console.log(JSON.stringify(err));
                
                $form.find(".pagela-note").text(
                        AJS.I18n.getText("pagela.macro.error.addLabel.message", errorMessage)).show()
                        .fadeOut(5000);
            });
        });

    }

    /**
     * Label selection - overwrite default style with select2
     */
    $(".pagela-select").auiSelect2();

    /**
     * Submit event handling
     */
    AJS.$(".pagela-form").on("aui-valid-submit", function (event) {
        event.preventDefault();

        var $input = $(this);
        var $form = $input.closest("form");

        getPageId($form)
          .done(function (response) {

            // check this is an actual response
            if ((typeof response !== "undefined") && (typeof response.results !== "undefined") && (response.results[0])) {
                // console.log(response);
                
                var pageId = response.results[0].id;                
                addLabelsToPage($(this.myForm), pageId);
            }

        }).fail(function (xhr, status, error) {
            var err = JSON.parse(xhr.responseText);
            var errorMessage = err.statusCode + ": " + err.reason;
            // console.log(JSON.stringify(err));
            
            $form.find(".pagela-note").text(AJS.I18n.getText("pagela.macro.error.getPageId.message", errorMessage)).show()
                    .fadeOut(5000);
        });

    });

    // // cannot be used with autocomplete field
    // AJS.formValidation.register(['pageexists'], function(field) {
    // var pageId = getPageId(field.args("value"));
    //        
    // if (typeof pageId === "undefined") {
    // field.invalidate(AJS.format("Not a page"));
    // } else {
    // field.validate();
    // }
    // });

    // // isBusy is reported as not being a function
    // AJS.$(document).on("click", "#add-labels", function () {
    // var that = this;
    // if (!that.isBusy()) {
    // that.busy();
    //
    // setTimeout(function () {
    // that.idle();
    // }, 2000);
    // }
    // });

})
