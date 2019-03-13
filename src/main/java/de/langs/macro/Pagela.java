package de.langs.macro;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.atlassian.confluence.content.render.xhtml.ConversionContext;
import com.atlassian.confluence.content.render.xhtml.DefaultConversionContext;
import com.atlassian.confluence.macro.Macro;
import com.atlassian.confluence.macro.MacroExecutionException;
import com.atlassian.confluence.plugin.services.VelocityHelperService;
import com.atlassian.confluence.plugin.webresource.ConfluenceWebResourceManager;
import com.atlassian.plugin.spring.scanner.annotation.component.Scanned;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;
import com.atlassian.renderer.RenderContext;
import com.atlassian.renderer.v2.RenderMode;
import com.atlassian.renderer.v2.macro.BaseMacro;
import com.atlassian.renderer.v2.macro.MacroException;
import com.atlassian.sal.api.message.I18nResolver;

@Scanned
public class Pagela extends BaseMacro implements Macro {

    private final VelocityHelperService velocityHelperService;

    private final ConfluenceWebResourceManager confluenceWebResourceManager;

    private final I18nResolver i18n;

    @Autowired
    public Pagela(@ComponentImport VelocityHelperService velocityHelperService,
            @ComponentImport ConfluenceWebResourceManager confluenceWebResourceManager,
            @ComponentImport I18nResolver i18n) {
        this.velocityHelperService = velocityHelperService;
        this.confluenceWebResourceManager = confluenceWebResourceManager;
        this.i18n = i18n;
    }

    @Override
    public String execute(Map macroParams, String s, RenderContext renderContext) throws MacroException {
        try {
            return execute(macroParams, s, new DefaultConversionContext(renderContext));
        } catch (MacroExecutionException e) {
            throw new MacroException(e.getMessage());
        }
    }

    @Override
    public String execute(Map<String, String> parameters, String body, ConversionContext conversionContext)
            throws MacroExecutionException {

        String buttonText = parameters.get("buttonText");
        if (StringUtils.isBlank(buttonText)) {
            buttonText = i18n.getText("de.langs.pagela-macro.pagela.param.buttonText.default");
        }
        String labelAltName = parameters.get("labelAltName");
        if (StringUtils.isBlank(labelAltName)) {
            labelAltName = i18n.getText("de.langs.pagela-macro.pagela.param.labelAltName.default");
        }
        String labelHelp = parameters.get("labelHelp");
        if (StringUtils.isBlank(labelHelp)) {
            labelHelp = i18n.getText("de.langs.pagela-macro.pagela.param.labelHelp.default");
        }
        String pageAltName = parameters.get("pageAltName");
        if (StringUtils.isBlank(pageAltName)) {
            pageAltName = i18n.getText("de.langs.pagela-macro.pagela.param.pageAltName.default");
        }
        String pageHelp = parameters.get("pageHelp");
        if (StringUtils.isBlank(pageHelp)) {
            pageHelp = i18n.getText("de.langs.pagela-macro.pagela.param.pageHelp.default");
        }

        String labels = parameters.get("labels");
        List<String> labelsList = new ArrayList<String>();
        if (labels.contains(",")) {
            labelsList = Arrays.asList(labels.split(","));
        } else {
            // just one
            labelsList = Arrays.asList(labels);
        }

        final Map<String, Object> contextMap = getMacroVelocityContext();
        contextMap.put("buttonText", buttonText);
        contextMap.put("labelAltName", labelAltName);
        contextMap.put("labelHelp", labelHelp);
        contextMap.put("pageAltName", pageAltName);
        contextMap.put("pageHelp", pageHelp);
        contextMap.put("labels", labelsList);
        contextMap.put("webResourceManager", confluenceWebResourceManager);

        return renderWithVelocityTemplate(contextMap);
    }

    public BodyType getBodyType() {
        return BodyType.NONE;
    }

    public OutputType getOutputType() {
        return OutputType.BLOCK;
    }

    @Override
    public RenderMode getBodyRenderMode() {
        return RenderMode.NO_RENDER;
    }

    @Override
    public boolean hasBody() {
        return false;
    }

    private String renderWithVelocityTemplate(Map<String, Object> contextMap) {
        return velocityHelperService.getRenderedTemplate("/vm/pagela-macro.vm", contextMap);
    }

    private Map<String, Object> getMacroVelocityContext() {
        return velocityHelperService.createDefaultVelocityContext();
    }
}
