/*
 * Copyright (c) 2003 Atanion GmbH, Germany
 * All rights reserved. Created 07.02.2003 16:00:00.
 * $Id$
 */
package com.atanion.tobago.renderkit.html.scarborough.standard.tag;

import com.atanion.tobago.TobagoConstants;
import com.atanion.tobago.webapp.TobagoResponseWriter;
import com.atanion.tobago.component.ComponentUtil;
import com.atanion.tobago.renderkit.DirectRenderer;
import com.atanion.tobago.renderkit.SelectOneRendererBase;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.faces.component.NamingContainer;
import javax.faces.component.UIComponent;
import javax.faces.component.UISelectItems;
import javax.faces.component.UISelectOne;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import javax.faces.model.SelectItem;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;

public class RadioGroupRenderer extends SelectOneRendererBase
 implements DirectRenderer {

// ///////////////////////////////////////////// constant

  private static final Log LOG = LogFactory.getLog(RadioGroupRenderer.class);

// ///////////////////////////////////////////// attribute

// ///////////////////////////////////////////// constructor

// ///////////////////////////////////////////// code

  public void encodeDirectEnd(FacesContext facesContext,
      UIComponent uiComponent) throws IOException {

    UISelectOne component = (UISelectOne) uiComponent;
    if (LOG.isDebugEnabled()) {
      for (Iterator i = component.getChildren().iterator(); i.hasNext();) {
        Object o = i.next();
        LOG.debug("ITEMS " + o);
        if (o instanceof UISelectItems) {
          UISelectItems uiitems = (UISelectItems) o;
          Object v = uiitems.getValue();
          LOG.debug("VALUE " + v);
          if (v != null) {
            LOG.debug("VALUE " + v.getClass().getName());
          }
        }
      }
    }

    List items = ItemsRenderer.getItemsToRender(component);

    boolean inline = ComponentUtil.getBooleanAttribute(component, ATTR_INLINE);

    TobagoResponseWriter writer
        = (TobagoResponseWriter) facesContext.getResponseWriter();

    if (! inline) {
      writer.startElement("table", null);
      writer.writeAttribute("border", "0", null);
      writer.writeAttribute("cellspacing", "0", null);
      writer.writeAttribute("cellpadding", "0", null);
      writer.writeAttribute("summary", "", null);
    }

    Object value = component.getValue();
    for (Iterator i = items.iterator(); i.hasNext(); ) {
      SelectItem item = (SelectItem) i.next();


      if (! inline) {
        writer.startElement("tr", null);
        writer.startElement("td", null);
      }

      String clientId = component.getClientId(facesContext);
      String id = clientId + NamingContainer.SEPARATOR_CHAR
          + NamingContainer.SEPARATOR_CHAR + item.getValue().toString();

      writer.startElement("input", component);
      writer.writeAttribute("type", "radio", null);
      writer.writeAttribute("class", null, TobagoConstants.ATTR_STYLE_CLASS);
      if (item.getValue().equals(value)) {
        writer.writeAttribute("checked", "checked", null);
      }
      writer.writeAttribute("name", component.getClientId(facesContext), null);
      writer.writeAttribute("id", id, null);
      writer.writeAttribute("value", item.getValue(), null);
      writer.writeAttribute("disabled",
          ComponentUtil.getBooleanAttribute(component, ATTR_DISABLED));
      writer.endElement("input");

      if (item.getLabel() != null) {


        if (! inline) {
          writer.endElement("td");
          writer.startElement("td", null);
        }

        // fixme: use created UIOutput Label
        // fixme: see outcommented part
        writer.startElement("label", null);
        writer.writeAttribute("for", id, null);
        writer.writeText(item.getLabel(), null);
        writer.endElement("label");
//        Application application = tobagoContext.getApplication();
//        UIOutput label = (UIOutput)
//            application.createComponent(TobagoConstants.COMPONENT_TYPE_OUTPUT);
//        label.getAttributes().put(TobagoConstants.ATTR_FOR, itemId);
//        label.setValue( item.getLabel() );
//        label.setRendererType("Label");
//        label.setRendered(true);
//
//        RenderUtil.encode(label);

      }
      if (! inline) {
        writer.endElement("td");
        writer.endElement("tr");
      }
    }
    if (! inline) {
      writer.endElement("table");
    }
  }

  public int getFixedHeight(FacesContext facesContext, UIComponent component) {
    List items = ItemsRenderer.getItemsToRender((UISelectOne) component);
    return items.size() * super.getFixedHeight(facesContext, component);
  }
// ///////////////////////////////////////////// bean getter + setter

}

