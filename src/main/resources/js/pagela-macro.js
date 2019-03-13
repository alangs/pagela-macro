AJS.toInit(function ($) {

    /**
     * Get the pageId given the page name.
     * @return id
     */
    var getPageId = function (pageName, callback) {
        //console.log("getPageId CALLED " + pageName);

        var quote = "'";
        if (pageName.includes("'")) {
            quote = "\"";
        }
        var id;
        AJS.$.ajax({
            type : "GET",
            url : AJS.params.contextPath
                    + "/rest/api/content/search?cql=type=page+and+title="
                    + quote + pageName + quote,
            success : function (response) {
                console.log(response);
                if (response.results[0]) {
                    id = response.results[0].id;
                }
                // callback();
            },
            error : function (xhr, status, error) {
                var err = JSON.parse(xhr.responseText);
                console.log(err);
                console.log(JSON.stringify(err));
            },
            async : false,
            dataType : "json"
        });
        console.log("pageId: " + id);
        return id;
    }

    /**
     * Add given label to a page given its id.
     * @param pageId the id of the page to which to add the label to
     * @param labelString the label as a String to add to the page
     */
    var addLabel = function (pageId, labelString, callback) {
        //console.log("addLabel CALLED " + pageId + " with " + labelString);

        // this action requires a security token via safe wrapper to ajax
        AJS.safe.ajax({
            type : "POST",
            url : AJS.params.contextPath + "/json/addlabelactivity.action",
            data : {
                entityIdString : pageId,
                labelString : labelString
            },
            success : function (response) {
                console.log(response);
                // callback();
            },
            error : function (xhr, status, error) {
                var err = JSON.parse(xhr.responseText);
                console.log(err);
                console.log(JSON.stringify(err));
            },
            async : false,
            dataType : "json"
        });
    };

    /**
     * Label selection - overwrite default style with select2
     */
    $(".pagela-select").auiSelect2();

    //$("#add-labels").click(function (event) {
    /**
     * Submit event handling
     */
    AJS.$(".pagela-form").on("aui-valid-submit", function (event) {
        event.preventDefault();
        
        var $input = $(this);
        var $form = $input.closest("form");
        // get page from input field
        var page = $form.find("input[name='pageToAddLabelsTo']").val();
        var pageId = getPageId(page);
        
        var pageAltName = $form.find("input[name='pageAltName']").val();

        if (typeof pageId === "undefined") {
            $form.find(".pagela-note").text(AJS.I18n.getText("pagela.macro.page.unknown.message", pageAltName)).show().fadeOut(5000);
            return false;
        }

        $form.find(".pagela-select option:selected").each(function () {
            // # $(this).val() returns the selected option
            addLabel(pageId, $(this).val(), function () {
                // TODO add success message here?
            });
        });
        
        $form.find(".pagela-note").text(AJS.I18n.getText("pagela.macro.success.message")).show().fadeOut(3000);
        
    });

//    // cannot be used with autocomplete field
//    AJS.formValidation.register(['pageexists'], function(field) {
//        var pageId = getPageId(field.args("value"));
//        
//        if (typeof pageId === "undefined") {
//            field.invalidate(AJS.format("Not a page"));
//        } else {
//            field.validate();
//        }
//    });
    
//    // isBusy is reported as not being a function    
//    AJS.$(document).on("click", "#add-labels", function () {
//        var that = this;
//        if (!that.isBusy()) {
//            that.busy();
//
//            setTimeout(function () {
//                that.idle();
//            }, 2000);
//        }
//    });

})
