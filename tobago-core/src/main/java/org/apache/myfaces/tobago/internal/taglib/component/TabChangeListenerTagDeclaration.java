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

package org.apache.myfaces.tobago.internal.taglib.component;

import org.apache.myfaces.tobago.apt.annotation.SimpleTag;
import org.apache.myfaces.tobago.apt.annotation.Tag;
import org.apache.myfaces.tobago.apt.annotation.TagAttribute;

import jakarta.el.ValueExpression;

/**
 * Register an TabChangedListener instance on the UIComponent
 * associated with the closest parent UIComponent custom action.
 */
@Tag(name = "tabChangeListener")
@SimpleTag(
    faceletHandler = "org.apache.myfaces.tobago.facelets.TabChangeListenerHandler")
public interface TabChangeListenerTagDeclaration {

  /**
   * Fully qualified Java class name of a TabChangeListener to be
   * created and registered.
   */
  @TagAttribute(required = true, name = "type", type = "java.lang.String")
  void setType(final ValueExpression type);

  /**
   * The value binding expression to a TabChangeListener.
   */
  @TagAttribute(name = "binding", type = "org.apache.myfaces.tobago.event.TabChangeListener")
  void setBinding(final ValueExpression binding);

}
