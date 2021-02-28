const json = {
    levelZeroId: 0,
    levelZeroTitle: "This is the title on level 0",
    levelZeroItemList: ["0_item_1", "0_item_2", "0_item_3"],
    levelZeroObject: {
        levelOneObjectId: 1,
        levelOneObjectTitle: "This is the title on level 1",
        levelOneListOfObjects: [
            {
                levelTwoObjectOneInArrayTitle: "This is the title for object 1 in the array",
                levelTwoObjectOneInArrayItemsList: ["2_item_1", "2_item_2", "2_item_3"]
            },
            {
                levelTwoObjectTwoInArrayTitle: "This is the title for object 2 in the array",
                levelTwoObjectTwoInArrayAssociativeArray: {
                    levelThreeObjectOne: {
                        levelThreeObjectOneTitle: "This is the title for object 1 on level 3 in the associative array"
                    },
                    levelThreeObjectTwo: {
                        levelThreeObjectTwoTitle: "This is the title for object 2 on level 3 in the associative array"
                    },
                },
            }
        ]
    },
    levelZeroObjectTwo: {
        levelZeroObjectTwoTitle: "This is the title for the 2nd object on level 0",
        levelZeroObjectTwoListItems: ["1_item_0", "1_item_1", "1_item_2"],
        levelZeroObjectTwoObjectList: [
            {
                title: "levelZeroObjectTwoObjectList first object title"
            },
            {
                title: "levelZeroObjectTwoObjectList second object title",
                body: "levelZeroObjectTwoObjectList second object body",
                levelZeroObjectTwoObjectListSubObjectList: [
                    {
                        title: "levelZeroObjectTwoObjectListSubObjectList first element title"
                    },
                    {
                        title: "levelZeroObjectTwoObjectListSubObjectList second element title",
                        items: ["item1", "item2", "item3", "item4"]
                    },
                ]
            },
        ]
    }
}

document.getElementById('original-json-displayer').innerHTML = JSON.stringify(json, undefined, 2);
const transformedJsonDisplayer = document.getElementById('transformed-json-displayer');


const create = (parent, key, value, index) => {
    let depth = parent?.depth ?? 0;
    if(typeof value !== "object" && !Array.isArray(value)){
        list.push(new KeyValuePair(parent, key, value, depth+1, index))
    }else if(Array.isArray(value)) {
        depth++;
        const arrayContainer = new JsonArrayContainer(parent, key, depth)
        list.push(arrayContainer)
        // Array items are primitive types
        if((value.every(item => typeof item !== 'object' || !Array.isArray(item)))){
            value.forEach((val, index) => create(arrayContainer, index, val, index))
        }else{
            // Array items are non-primitive types
            value.forEach((val, index) => {
                Object.entries(val).forEach(v => create(arrayContainer, arrayContainer.name, v, index))
            })
        }
    }else if(typeof value === 'object'){
        depth++;
        const objectContainer = new JsonObjectContainer(parent, key, depth);
        list.push(objectContainer);
        Object.entries(value).forEach(([key, val], index) => create(objectContainer, key, val))
    }
}

class JsonObjectContainer {
    constructor(parent, name, depth){
        this.parent = parent;
        this.name = name;
        this.depth = depth;
    }
}

class JsonArrayContainer {
    constructor(parent, name, depth){
        this.parent = parent;
        this.name = name;
        this.depth = depth;
    }
}

class JsonValue {
    constructor(value){
        this.id = Math.floor(Math.random() * 100000);
        this.value = value;
    }
}

class KeyValuePair {
    constructor(parent, name, value, depth, index){
        this.parent = parent;
        this.name = name;
        this.value = value;
        this.depth = depth;
        this.index = index;
    }

    handleClick() {
        console.log(`${this.name} CLICKED!`)
        console.log(this.calcParentTree)
    }

    get calcParentTree () {
        let parents = (this.index && isNaN(parseInt(this.name, 10))) ? [this.index, this.name] : [this.name];

        let parent = this.parent;
        while(parent){
            parents.push(parent.name);
            parent = parent.parent;
        }

        return parents.reverse();
    }
}

class ArrayItem {
    constructor(propName, value, index){
        this.propName = propName;
        this.value = value;
        this.index = index;
    }
}

let list = [];

Object.entries(json).forEach(([key, value], index) => {
    create(null, key, value)
})

console.log(list)

const createJsonRow = (prop) => {
    const row = document.createElement('div');
    row.className = 'json-row';
    if(prop.depth) row.dataset.depth = prop.depth;

    const createKey = (key, parent) => {
        const keyElement = document.createElement('span');
        keyElement.className = 'json-row-key';
        keyElement.innerHTML = key;
        keyElement.dataset.parent = parent;
        return keyElement;
    }
    
    const createValue = (value) => {
        const valueElement = document.createElement('span');
        valueElement.className = 'json-row-value';
        valueElement.innerHTML = value;
        valueElement.addEventListener('click', () => prop.handleClick())
        return valueElement;
    }

    row.appendChild(createKey(prop.name, prop.depth))

    if(prop?.value){
        row.appendChild(createValue(prop.value));
    }

    transformedJsonDisplayer.appendChild(row);
}

list.forEach(item => {
    createJsonRow(item)
});