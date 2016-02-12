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

package org.apache.myfaces.tobago.renderkit.html;

import org.apache.myfaces.tobago.internal.component.AbstractUICommand;
import org.apache.myfaces.tobago.renderkit.util.RenderUtils;
import org.apache.myfaces.tobago.util.ComponentUtils;

import javax.faces.component.behavior.AjaxBehavior;
import javax.faces.component.behavior.ClientBehavior;
import javax.faces.component.behavior.ClientBehaviorContext;
import javax.faces.context.FacesContext;
import javax.faces.render.ClientBehaviorRenderer;
import java.util.Collection;

public class AjaxClientBehaviorRenderer extends ClientBehaviorRenderer {

  @Override
  public String getScript(ClientBehaviorContext behaviorContext, ClientBehavior behavior) {

    final AjaxBehavior ajaxBehavior = (AjaxBehavior) behavior;
    final AbstractUICommand component = (AbstractUICommand) behaviorContext.getComponent();
    final FacesContext facesContext = behaviorContext.getFacesContext();
    final Collection<String> render = ajaxBehavior.getRender();

    final Command command = new Command(
        null,
        component.isTransition(),
        component.getTarget(),
        RenderUtils.generateUrl(facesContext, component),
        ComponentUtils.evaluateClientIds(facesContext, component, render.toArray(new String[render.size()])),
        null,
        null, // getConfirmation(command), // todo
        null,
        Popup.createPopup(component),
        component.isOmit());

    final CommandMap map = new CommandMap();
    map.addCommand(behaviorContext.getEventName(), command);
    return JsonUtils.encode(map);
  }
}