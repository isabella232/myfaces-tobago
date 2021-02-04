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
// @ts-ignore
import { Datepicker } from "vanillajs-datepicker";
import { DateUtils } from "./tobago-date-utils";
import { Page } from "./tobago-page";
class DatePicker extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        var _a;
        const field = this.field;
        const locale = Page.page(this).locale;
        const i18n = this.i18n;
        i18n.titleFormat = "MM y"; // todo i18n
        i18n.format = this.pattern;
        Datepicker.locales[locale] = i18n;
        const options = {
            buttonClass: "btn",
            orientation: "bottom top auto",
            autohide: true,
            language: locale,
            todayBtn: this.todayButton,
            todayBtnMode: 1
            // todo readonly
            // todo show week numbers
        };
        const datepicker = new Datepicker(field, options);
        // XXX these listeners are needed as long as we have a solution for:
        // XXX https://github.com/mymth/vanillajs-datepicker/issues/13
        // XXX the 2nd point is missing the "normal" change event on the input element
        field.addEventListener("keyup", (event) => {
            // console.info("event -----> ", event.type);
            if (event.metaKey || event.key.length > 1 && event.key !== "Backspace" && event.key !== "Delete") {
                return;
            }
            // back up user's input when user types printable character or backspace/delete
            const target = event.target;
            target._oldValue = target.value;
        });
        field.addEventListener("focus", (event) => {
            // console.info("event -----> ", event.type);
            this.lastValue = field.value;
        });
        field.addEventListener("blur", (event) => {
            // console.info("event -----> ", event.type);
            const target = event.target;
            // no-op when user goes to another window or the input field has no backed-up value
            if (document.hasFocus() && target._oldValue !== undefined) {
                if (target._oldValue !== target.value) {
                    target.datepicker.setDate(target._oldValue || { clear: true });
                }
                delete target._oldValue;
            }
            if (this.lastValue !== field.value) {
                field.dispatchEvent(new Event("change"));
            }
        });
        datepicker.element.addEventListener("changeDate", (event) => {
            // console.info("event -----> ", event.type);
            field.dispatchEvent(new Event("change"));
        });
        // simple solution for the picker: currently only open, not close is implemented
        (_a = this.querySelector(".tobago-date-picker")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (event) => {
            this.field.focus();
        });
    }
    get todayButton() {
        return this.hasAttribute("today-button");
    }
    set todayButton(todayButton) {
        if (todayButton) {
            this.setAttribute("today-button", "");
        }
        else {
            this.removeAttribute("today-button");
        }
    }
    get pattern() {
        const pattern = this.getAttribute("pattern");
        return DateUtils.convertPatternJava2Js(pattern); // todo: to the conversation in Java, not here
    }
    get i18n() {
        const i18n = this.getAttribute("i18n");
        return i18n ? JSON.parse(i18n) : undefined;
    }
    get field() {
        const rootNode = this.getRootNode();
        return rootNode.getElementById(this.id + "::field");
    }
}
document.addEventListener("tobago.init", function (event) {
    if (window.customElements.get("tobago-date") == null) {
        window.customElements.define("tobago-date", DatePicker);
    }
});
//# sourceMappingURL=tobago-date.js.map