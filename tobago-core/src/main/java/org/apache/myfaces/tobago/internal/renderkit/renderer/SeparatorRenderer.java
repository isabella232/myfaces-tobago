/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.apache.myfaces.tobago.internal.renderkit.renderer;

import org.apache.myfaces.tobago.component.Facets;
import org.apache.myfaces.tobago.internal.component.AbstractUILabel;
import org.apache.myfaces.tobago.internal.component.AbstractUISeparator;
import org.apache.myfaces.tobago.renderkit.RendererBase;
import org.apache.myfaces.tobago.renderkit.css.BootstrapClass;
import org.apache.myfaces.tobago.renderkit.css.TobagoClass;
import org.apache.myfaces.tobago.renderkit.html.HtmlElements;
import org.apache.myfaces.tobago.util.ComponentUtils;
import org.apache.myfaces.tobago.webapp.TobagoResponseWriter;

import jakarta.faces.component.UIComponent;
import jakarta.faces.context.FacesContext;
import java.io.IOException;

public class SeparatorRenderer<T extends AbstractUISeparator> extends RendererBase<T> {

  @Override
  public void encodeEndInternal(final FacesContext facesContext, final T component) throws IOException {

    final TobagoResponseWriter writer = getResponseWriter(facesContext);
    final String clientId = component.getClientId(facesContext);

    if (isInside(facesContext, HtmlElements.COMMAND)) {
      writer.startElement(HtmlElements.TOBAGO_SEPARATOR);
      writer.writeIdAttribute(clientId);
      writer.writeClassAttribute(
          BootstrapClass.DROPDOWN_DIVIDER,
          component.getCustomClass());
      writer.endElement(HtmlElements.TOBAGO_SEPARATOR);
    } else {
      final String label = getLabel(component);
      if (label != null) {
        writer.startElement(HtmlElements.P);
        writer.writeIdAttribute(clientId);
        writer.writeClassAttribute(
            TobagoClass.SEPARATOR,
            component.getCustomClass());
        writer.writeText(label);
        writer.endElement(HtmlElements.P);
      } else {
        writer.startElement(HtmlElements.HR);
        writer.writeIdAttribute(clientId);
        writer.writeClassAttribute(
            TobagoClass.SEPARATOR,
            component.getCustomClass());
        writer.endElement(HtmlElements.HR);
      }
    }
  }

  private String getLabel(final AbstractUISeparator separator) {
    String label = separator.getLabel();
    final UIComponent facet = ComponentUtils.getFacet(separator, Facets.label);
    if (label == null && facet != null) {
      label = String.valueOf(((AbstractUILabel) facet).getValue());
    }
    return label;
  }
}
