import { StyleList } from "./style-list";
// Creates a Constructor that takes in an HTML Element and Populates it with a Style Selector
function StyleSelector(envElement) {
    
    this.environment = envElement;

    /* handleChange():: Event -> VOID
        When a change has been detected under the Select Tag, gets the current value of the selector and
        changes the theme of CodeMirror to the value specified by the selector.
        Function is stringified for this application.
    */
    this.handleChange = `
    let styleSelector = document.getElementById('selector');
    let themeBox = document.getElementById('theme-selector');
    themeBox.className = styleSelector.value;
    // console.log(styleSelector);
    // console.log(styleSelector.value);`;
    
    /* display():: -> VOID
        Constructs the HTML Selection for the Styles. First, it maps the array from style-list.js into a series of options.
        Then it concatenates that into the select tag and modified the innerHTML of the HTML Environment.
    */
    this.display = function() {

        let queryHTML = "";
        for (let index in StyleList) {
            let item = StyleList[index];
            let itemHTML = `<div key=${item.key}>
                <option id="${item.id}" name="style-selection" value="${item.themeName}">
                <label for="${item.id}">${item.displayName}</label></option>
            </div>`;
            
            // console.log(itemHTML);
            queryHTML += itemHTML;
        }
        // console.log(queryHTML);

        envElement.innerHTML = `<select id="selector" onChange="${this.handleChange}" class="form-control" style="width: 200px">${queryHTML}</select>`;
    }
}

export default StyleSelector;
