import { StyleList } from "./style-list";

function StyleSelector(envElement) {
    console.log(this);
    this.environment = envElement;

    this.handleChange = `
    console.log(this.value);
    const themeBox = document.getElementById('theme-selector');
    themeBox.className = this.value;`;
    
    this.display = function() {

        let queryHTML = "";
        for (let index in StyleList) {
            let item = StyleList[index];
            let itemHTML = `<div key=${item.key}>
                <input type="radio" id=${item.id} name="style-selection" value=${item.themeName} onClick="${this.handleChange}" />
                <label for=${item.id}>${item.displayName}</label><br />
            </div>`;
            
            console.log(itemHTML);
            queryHTML += itemHTML;
        }
        console.log(queryHTML);

        envElement.innerHTML = `<form>${queryHTML}</form>`;
    }
}

// import React, { Component } from 'react';

// class StyleSelector extends Component {

//     handleChange(e) {
//         e.preventDefault();
//         console.log(e.target);
//     }
//     //{(event) => this.handleChange(event)}
//     render() {
//         return(
//             <form>
//                 {StyleList.map((item, index) => {
//                     return(
//                         <div key={item.value}>
//                             <input type="radio" id={item.id} name="style-selection" value={item.value} onClick={(event) => {console.log(event)}} />
//                             <label htmlFor={item.id}>{item.displayName}</label><br />
//                         </div>)
//                 })}
//             </form>
//         )
//     }
// }

export default StyleSelector;