/*
 * Copyright (c) 2002 Atanion GmbH, Germany
 * All rights reserved. Created 19.08.2002 at 16:07:05.
 * $Id$
 */
package com.atanion.tobago.taglib.component;

import com.atanion.tobago.component.UITabGroup;

import javax.faces.component.UIComponent;

public class TabGroupTag extends TobagoTag {
// ----------------------------------------------------------------- attributes

  private String serverside;

// ----------------------------------------------------------- business methods

  public String getComponentType() {
    return UITabGroup.COMPONENT_TYPE;
  }

  protected void setProperties(UIComponent component) {
    super.setProperties(component);
    setBooleanProperty(component, ATTR_SERVER_SIDE_TABS, serverside);
  }

  public void release() {
    super.release();
    serverside = null;
  }

// ------------------------------------------------------------ getter + setter

  public String getServerside() {
    return serverside;
  }

  public void setServerside(String serverside) {
    this.serverside = serverside;
  }
}

