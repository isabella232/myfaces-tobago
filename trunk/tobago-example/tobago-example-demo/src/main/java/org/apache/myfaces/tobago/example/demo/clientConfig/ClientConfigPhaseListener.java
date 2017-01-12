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

package org.apache.myfaces.tobago.example.demo.clientConfig;

import javax.faces.context.FacesContext;
import javax.faces.event.PhaseEvent;
import javax.faces.event.PhaseId;
import javax.faces.event.PhaseListener;

public class ClientConfigPhaseListener implements PhaseListener {

  public static final String[] BEAN_NAMES
      = {"clientConfigController", "clientConfigController2"};

  @Override
  public void afterPhase(final PhaseEvent event) {
  }

  @Override
  public void beforePhase(final PhaseEvent event) {
    final FacesContext facesContext = FacesContext.getCurrentInstance();
    for (int i = 0; i < BEAN_NAMES.length; i++) {
      final String beanName = BEAN_NAMES[i];
      final ClientConfigController controller = ClientConfigController
          .getCurrentInstance(facesContext, beanName);

      if (controller != null) {
        controller.loadFromTobagoContext();
      }
    }
  }

  @Override
  public PhaseId getPhaseId() {
    return PhaseId.RENDER_RESPONSE;
  }
}
