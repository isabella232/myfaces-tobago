package org.apache.myfaces.tobago.taglib.component;

/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import org.apache.myfaces.tobago.apt.annotation.BodyContent;
import org.apache.myfaces.tobago.apt.annotation.Tag;
import org.apache.myfaces.tobago.apt.annotation.TagAttribute;
import org.apache.myfaces.tobago.apt.annotation.UIComponentTag;
import org.apache.myfaces.tobago.apt.annotation.UIComponentTagAttribute;
import org.apache.myfaces.tobago.taglib.decl.HasId;

@Tag(name = "gridConstraints", bodyContent = BodyContent.EMPTY)
@UIComponentTag(
    uiComponent = "org.apache.myfaces.tobago.component.UIGridConstraints",
    uiComponentBaseClass = "org.apache.myfaces.tobago.component.AbstractUIGridConstraints",
    componentFamily = "org.apache.myfaces.tobago.GridConstraints",
    allowedChildComponenents = "NONE", isLayout = true)
public interface GridConstraintsTagDeclaration extends HasId {

  /**
   *  The width for this component.
   */
  @TagAttribute
  @UIComponentTagAttribute(type = "org.apache.myfaces.tobago.layout.Measure")
  void setWidth(String width);

  /**
   *  The height for this component.
   */
  @TagAttribute
  @UIComponentTagAttribute(type = "org.apache.myfaces.tobago.layout.Measure")
  void setHeight(String height);
}
