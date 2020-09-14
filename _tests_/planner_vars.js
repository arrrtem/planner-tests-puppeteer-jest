const data = {
    country: {
        china: "China",
        australia: "Australien"
    },
    traverConditionSelectorsList: {
        langzeitaufenthalt: "div.tool-types-list div:nth-child(1) div.type-item-label", // "div.tool-types-list div:nth-child(1) span:nth-child(1)",
        backpacking: "div.tool-types-list div:nth-child(2) div.type-item-label",
        hotelKreuzfahrtMitAusflügen: "div.tool-types-list div:nth-child(3) div.type-item-label",
        hotelurlaubOhneAusflüge: "div.tool-types-list div:nth-child(4) div.type-item-label",
        grobstadturlaub: "div.tool-types-list div:nth-child(5) div.type-item-label",
    },
    traverConditionName: {
        langzeitaufenthalt: "Langzeitaufenthalt",
        backpacking: "Backpacking-/Abenteuerreise",
        hotelKreuzfahrtMitAusflügen: "Hotel / Kreuzfahrt mit Ausflügen",
        hotelurlaubOhneAusflüge: "Hotelurlaub ohne Ausflüge",
        grobstadturlaub: "Großstadturlaub"
    }
};

module.exports = data;