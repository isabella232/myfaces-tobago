/*
 * Copyright 2002-2005 The Apache Software Foundation.
 * 
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 * 
 *        http://www.apache.org/licenses/LICENSE-2.0
 * 
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
/*
 * Created 29.06.2004 11:07:07.
 * $Id:TobagoMultipartFormdataRequestUnitTest.java 1300 2005-08-10 16:40:23 +0200 (Mi, 10 Aug 2005) lofwyr $
 */
package org.apache.myfaces.tobago.webapp;

import junit.framework.TestCase;
import org.apache.commons.fileupload.FileItem;
import org.apache.myfaces.tobago.mock.servlet.MockHttpServletRequest;

import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

public class TobagoMultipartFormdataRequestUnitTest extends TestCase {

// ///////////////////////////////////////////// constant

  private static final String SNIP = "--";

  private static final String BOUNDARY = "xxx";

  private static final String NEWLINE = "\r\n";


// ///////////////////////////////////////////// attribute

  private TobagoMultipartFormdataRequest request;

// ///////////////////////////////////////////// constructor

  public TobagoMultipartFormdataRequestUnitTest(String reference)
      throws UnsupportedEncodingException {
    super(reference);
    String body
        = SNIP + BOUNDARY + NEWLINE
        + parameter("color", "red")
        + parameter("city", "Amsterdam")
        + parameter("city", "Bonn")
        + parameter("city", "Pisa")
        + parameter("color", "green")
        + fileItem("file", "hello.txt", "Hello World!")
        + parameter("color", "blue")
        + parameter("color", "yellow")
        + parameter("country", "Trinidad & Tobago")
        + SNIP + BOUNDARY + SNIP + NEWLINE;

    MockHttpServletRequest mockRequest
        = new MockHttpServletRequest(body.getBytes("UTF-8"));

    request = new TobagoMultipartFormdataRequest(mockRequest, System.getProperty("java.io.tmpdir"), 1024 * 1024);
  }

// ///////////////////////////////////////////// code

  private String parameter(String key, String value) {
    return SNIP + BOUNDARY + NEWLINE
        + "Content-Disposition: form-data; name=\"" + key + "\"" + NEWLINE
        + NEWLINE
        + value + NEWLINE;
  }

  private String fileItem(String key, String filename, String value) {
    return SNIP + BOUNDARY + NEWLINE
        + "Content-Disposition: form-data; name=\""
        + key + "\"; filename=\"" + filename + "\"" + NEWLINE
        + "Content-Type: text/plain" + NEWLINE
        + NEWLINE
        + value + NEWLINE;
  }

  public void testGetFileItem() {

    FileItem item = request.getFileItem("file");
    assertNotNull(item);
    assertEquals("filename", "hello.txt", item.getName());
    assertEquals("content", "Hello World!", item.getString());
  }

  public void testGetParameter() {

    assertEquals("red", request.getParameter("color"));
    assertEquals("Amsterdam", request.getParameter("city"));
    assertEquals("Trinidad & Tobago", request.getParameter("country"));
    assertEquals(null, request.getParameter("empty"));
  }

  public void testGetParameterValues() {

    Set<String> expectedSet;
    Set<String> actualSet;

    expectedSet = new HashSet<String>(
        Arrays.asList(
            new String[]{
              "red", "green", "blue", "yellow"}));
    actualSet
        = new HashSet<String>(Arrays.asList(request.getParameterValues("color")));
    assertEquals("color", expectedSet, actualSet);

    expectedSet = new HashSet<String>(
        Arrays.asList(
            new String[]{
              "Amsterdam", "Bonn", "Pisa"}));
    actualSet = new HashSet<String>(Arrays.asList(request.getParameterValues("city")));
    assertEquals("city", expectedSet, actualSet);

    expectedSet = new HashSet<String>(
        Arrays.asList(
            new String[]{
              "Trinidad & Tobago"}));
    actualSet
        = new HashSet<String>(Arrays.asList(request.getParameterValues("country")));
    assertEquals("country", expectedSet, actualSet);

    assertEquals("empty", null, request.getParameterValues("empty"));
  }

  public void testGetParameterNames() {

    Set<Object> actual = new HashSet<Object>();
    Enumeration e = request.getParameterNames();
    while (e.hasMoreElements()) {
      actual.add(e.nextElement());
    }

    Set<String> expected = new HashSet<String>(
        Arrays.asList(
            new String[]{
              "color", "city", "country"}));

    assertEquals(expected, actual);
  }

  public void testGetParameterMap() {

    Map actual = request.getParameterMap();

    Map<String,String[]> expected = new HashMap<String, String[]>();
    expected.put("color", new String[]{"red", "green", "blue", "yellow"});
    expected.put("city", new String[]{"Amsterdam", "Bonn", "Pisa"});
    expected.put("country", new String[]{"Trinidad & Tobago"});

    assertEquals(expected.keySet(), actual.keySet());

    Set keys = actual.keySet();
    for (Iterator iterator = keys.iterator(); iterator.hasNext();) {
      String key = (String) iterator.next();
      String[] expectedStrings = expected.get(key);
      String[] actualStrings = (String[]) actual.get(key);
      assertEquals(expectedStrings.length, actualStrings.length);
      Set<String> expectedSet = new HashSet<String>(Arrays.asList(expectedStrings));
      Set<String> actualSet = new HashSet<String>(Arrays.asList(actualStrings));
      assertEquals(expectedSet, actualSet);
    }
  }
}
