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

package org.apache.myfaces.tobago.util;

import org.apache.myfaces.tobago.component.RendererTypes;
import org.apache.myfaces.tobago.component.UIIn;
import org.apache.myfaces.tobago.component.UIPanel;
import org.apache.myfaces.tobago.internal.config.AbstractTobagoTestBase;
import org.junit.Assert;
import org.junit.Test;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

public class ComponentUtilsUnitTest extends AbstractTobagoTestBase {

  @Test
  public void testSplitList() {
    Assert.assertArrayEquals(new String[]{"ab", "cd"}, ComponentUtils.splitList("ab cd"));
    Assert.assertArrayEquals(new String[]{"ab", "cd"}, ComponentUtils.splitList("ab  cd"));
    Assert.assertArrayEquals(new String[]{"ab", "cd"}, ComponentUtils.splitList("ab,  cd"));
    Assert.assertArrayEquals(new String[]{"ab", "cd"}, ComponentUtils.splitList("ab , cd"));
    Assert.assertArrayEquals(new String[]{"ab", "cd"}, ComponentUtils.splitList("ab,,cd"));
  }

  @Test
  public void testFindDescendant() {
    final FacesContext facesContext = FacesContext.getCurrentInstance();
    final UIComponent p = ComponentUtils.createComponent(
        facesContext, UIPanel.COMPONENT_TYPE, RendererTypes.Panel, "p");
    final UIComponent i = ComponentUtils.createComponent(
        facesContext, UIIn.COMPONENT_TYPE, RendererTypes.In, "i");
    p.getChildren().add(i);

    final UIIn in = ComponentUtils.findDescendant(p, UIIn.class);
    Assert.assertEquals(i, in);
  }
}
