/*
 * Copyright (c) 2003 Atanion GmbH, Germany
 * All rights reserved. Created 28.01.2003 14:10:33.
 * $Id$
 */
package com.atanion.tobago.taglib.component;

import com.atanion.tobago.component.ComponentUtil;
import com.atanion.tobago.component.UITree;

import javax.faces.component.UIComponent;

public class TreeTag extends BeanTag {

// ----------------------------------------------------------------- attributes

  private String hideJunctions;
  private String hideIcons;
  private String hideRoot;
  private String hideRootJunction;

  private String selectable;
  private String mutable;

  private String idReference;
  private String nameReference;

// ----------------------------------------------------------- business methods

  public String getComponentType() {
    return UITree.COMPONENT_TYPE;
  }

  protected void setProperties(UIComponent component) {
    super.setProperties(component);

   ComponentUtil.setBooleanProperty(component, ATTR_HIDE_JUNCTIONS, hideJunctions);
   ComponentUtil.setBooleanProperty(component, ATTR_HIDE_ICONS, hideIcons);
   ComponentUtil.setBooleanProperty(component, ATTR_HIDE_ROOT, hideRoot);
   ComponentUtil.setBooleanProperty(component, ATTR_HIDE_ROOT_JUNCTION, hideRootJunction);

   ComponentUtil.setStringProperty(component, ATTR_SELECTABLE, selectable);
   ComponentUtil.setBooleanProperty(component, ATTR_MUTABLE, mutable);

   ComponentUtil.setStringProperty(component, ATTR_ID_REFERENCE, idReference);
   ComponentUtil.setStringProperty(component, ATTR_NAME_REFERENCE, nameReference);
  }

  public void release() {
    super.release();
    hideJunctions = null;
    hideIcons = null;
    hideRoot = null;
    hideRootJunction = null;
    selectable = null;
    mutable = null;
    idReference = null;
    nameReference = null;
  }
// ------------------------------------------------------------ getter + setter

  public String getHideIcons() {
    return hideIcons;
  }

  public void setHideIcons(String hideIcons) {
    this.hideIcons = hideIcons;
  }

  public String getHideJunctions() {
    return hideJunctions;
  }

  public void setHideJunctions(String hideJunctions) {
    this.hideJunctions = hideJunctions;
  }

  public String getHideRoot() {
    return hideRoot;
  }

  public void setHideRoot(String hideRoot) {
    this.hideRoot = hideRoot;
  }

  public String getHideRootJunction() {
    return hideRootJunction;
  }

  public void setHideRootJunction(String hideRootJunction) {
    this.hideRootJunction = hideRootJunction;
  }

  public String getIdReference() {
    return idReference;
  }

  public void setIdReference(String idReference) {
    this.idReference = idReference;
  }

  public String getSelectable() {
    return selectable;
  }

  public void setSelectable(String selectable) {
    this.selectable = selectable;
  }

  public String getMutable() {
    return mutable;
  }

  public void setMutable(String mutable) {
    this.mutable = mutable;
  }

  public String getNameReference() {
    return nameReference;
  }

  public void setNameReference(String nameReference) {
    this.nameReference = nameReference;
  }
}

