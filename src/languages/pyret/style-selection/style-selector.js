import { StyleList } from "./style-list";

function StyleSelector(envElement) {
    console.log(this);
    this.environment = envElement;

    this.handleChange = `
    let styleSelector = document.getElementById('selector');
    let themeBox = document.getElementById('theme-selector');
    themeBox.className = styleSelector.value;
    // console.log(styleSelector);
    // console.log(styleSelector.value);`;
    
    this.display = function() {

        let queryHTML = "";
        for (let index in StyleList) {
            let item = StyleList[index];
            let itemHTML = `<div key=${item.key}>
                <option id="${item.id}" name="style-selection" value="${item.themeName}">
                <label for="${item.id}">${item.displayName}</label></option>
            </div>`;
            
            console.log(itemHTML);
            queryHTML += itemHTML;
        }
        console.log(queryHTML);

        envElement.innerHTML = `<select id="selector" onChange="${this.handleChange}" class="form-control" style="width: 200px">${queryHTML}</select>`;
    }
}

export default StyleSelector;