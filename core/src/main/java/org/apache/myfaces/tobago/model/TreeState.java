package org.apache.myfaces.tobago.model;

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

import org.apache.commons.lang.StringUtils;

import javax.swing.tree.DefaultMutableTreeNode;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.Set;

/**
 * Manages the state on a Tree:<br />
 * 1. selection: selected tree-nodes<br />
 * 2. expandState: open/close folder state<br />
 * 3. marker: last used action object<br />
 */
public class TreeState {

  private Set<TreePath> expanded;
  private Set<TreePath> selected;
  private Set<TreePath> marked;

  @Deprecated
  private Set<DefaultMutableTreeNode> selection;
  @Deprecated
  private Set<DefaultMutableTreeNode> expandState;
  @Deprecated
  private DefaultMutableTreeNode marker;
  @Deprecated
  private DefaultMutableTreeNode lastMarker;
  @Deprecated
  private String lastCommand;
  private Integer[] scrollPosition;

  public TreeState() {
    selection = new HashSet<DefaultMutableTreeNode>();
    expandState = new HashSet<DefaultMutableTreeNode>();
    expanded = new HashSet<TreePath>();
    selected = new HashSet<TreePath>();
    marked = new HashSet<TreePath>();
  }

  public Set<TreePath> getExpanded() {
    return expanded;
  }

  public Set<TreePath> getSelected() {
    return selected;
  }

  public Set<TreePath> getMarked() {
    return marked;
  }

  @Deprecated
  public void addExpandState(DefaultMutableTreeNode expandStateItem) {
    expandState.add(expandStateItem);
  }

  @Deprecated
  public void addSelection(DefaultMutableTreeNode selectItem) {
    selection.add(selectItem);
  }

  @Deprecated
  public void clearExpandState() {
    expandState.clear();
  }

  @Deprecated
  public void clearSelection() {
    selection.clear();
  }

  /**
   * Adds a (external created) node to the actually marked node.
   */
  @Deprecated
  public void commandNew(DefaultMutableTreeNode newNode) {
    marker.insert(newNode, 0);
    setLastMarker(null);
    setLastCommand(null);
  }

  @Deprecated
  public void expand(DefaultMutableTreeNode node, int level) {
    if (level > 0) {
      if (!expandState.contains(node)) {
        expandState.add(node);
      }
      for (Enumeration i = node.children(); i.hasMoreElements();) {
        DefaultMutableTreeNode child = (DefaultMutableTreeNode) i.nextElement();
        expand(child, level - 1);
      }
    }
  }

  /**
   * Expands all parents which contains selected children.
   */
  @Deprecated
  public void expandSelection() {
    for (DefaultMutableTreeNode treeNode : selection) {
      expandTo(treeNode);
    }
  }

  @Deprecated
  public void expandTo(DefaultMutableTreeNode node) {
    node = (DefaultMutableTreeNode) node.getParent();
    while (node != null) {
      if (!expandState.contains(node)) {
        expandState.add(node);
      }
      node = (DefaultMutableTreeNode) node.getParent();
    }
  }

  @Deprecated
  public boolean isExpanded(DefaultMutableTreeNode node) {
    return expandState.contains(node);
  }

  @Deprecated
  public boolean isMarked(DefaultMutableTreeNode node) {
    return node != null && node.equals(marker);
  }

  @Deprecated
  public boolean isSelected(DefaultMutableTreeNode node) {
    return selection.contains(node);
  }

  @Deprecated
  public Set<DefaultMutableTreeNode> getExpandState() {
    return expandState;
  }

  @Deprecated
  public void setExpandState(Set<DefaultMutableTreeNode> expandState) {
    this.expandState = expandState;
  }

  @Deprecated
  public String getLastCommand() {
    return lastCommand;
  }

  @Deprecated
  public void setLastCommand(String lastCommand) {
    this.lastCommand = lastCommand;
  }

  @Deprecated
  public DefaultMutableTreeNode getLastMarker() {
    return lastMarker;
  }

  @Deprecated
  public void setLastMarker(DefaultMutableTreeNode lastMarker) {
    this.lastMarker = lastMarker;
  }

  @Deprecated
  public DefaultMutableTreeNode getMarker() {
    return marker;
  }

  @Deprecated
  public void setMarker(DefaultMutableTreeNode marker) {
    this.marker = marker;
  }

  @Deprecated
  public Set<DefaultMutableTreeNode> getSelection() {
    return selection;
  }

  @Deprecated
  public void setSelection(Set<DefaultMutableTreeNode> selection) {
    this.selection = selection;
  }

  public Integer[] getScrollPosition() {
    return scrollPosition;
  }

  public void setScrollPosition(Integer[] scrollPosition) {
    this.scrollPosition = scrollPosition;
  }

  public static Integer[] parseScrollPosition(String value) {
    Integer[] position = null;
    if (!StringUtils.isBlank(value)) {
      int sep = value.indexOf(";");
      if (sep == -1) {
        throw new NumberFormatException(value);
      }
      int left = Integer.parseInt(value.substring(0, sep));
      int top = Integer.parseInt(value.substring(sep + 1));
      position = new Integer[2];
      position[0] = left;
      position[1] = top;
    }
    return position;
  }

}

