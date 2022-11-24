"use strict";

let temporaryUser = {}

function handlerClick(event) {
    let result = checkIsNumber(input.value);

    if ('type2' in result) {
        if (result.type2 == 'age') {
            ageOutput.innerText = result.inputValue2 + '\n' + 'возраст сохранён';
            temporaryUser.age = result.inputValue2;
        } else {
            nameOutput.innerText = result.inputValue2 + '\n' + 'имя сохранено';
            temporaryUser.name = result.inputValue2;
        }
    }

    if (result.type1 == 'age') {
        ageOutput.innerText = result.inputValue1 + '\n' + 'возраст сохранён';
        temporaryUser.age = result.inputValue1;
    } else {
        nameOutput.innerText = result.inputValue1 + '\n' + 'имя сохранено';
        temporaryUser.name = result.inputValue1;
    }

    console.log(temporaryUser)
}

function handlerCountryClick() {
    let result = checkIsNumber(inputCountry.value);

    if (result.type1 == 'age') {
        countryOutput.innerText = 'вы ввели некорректную страну \n страна не была сохранена';
    } else {
        countryOutput.innerText = result.inputValue1 + '\n' + 'страна сохранена';
        temporaryUser.country = result.inputValue1;
    }

    console.log(temporaryUser)
}

class User {
    constructor(params) {
        this.age = 'age' in params ? params.age : 24;
        this.name = 'name' in params ? params.name : 'Alex';
        this.country = 'country' in params ? params.country : 'Australia';
    }
}

function clearAll() {
    input.value = '';
    input.Country = '';
    temporaryUser = {}
    ageOutput.innerText = '';
    nameOutput.innerText = '';
    countryOutput.innerText = '';
}

function handlerSendUserClick() {
    sendUserResponse.innerText = 'данные отправлены на сервер';
    let user = new User(temporaryUser);

    clearAll();
    let response = fetch('send-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    response.then(response => response.text()).then(responseText => console.log(JSON.parse(responseText)));
}

function writeResult(responseText) {
    let responseArray = JSON.parse(responseText);
    let resultString = '';

    function stringAddField(id, age, name, country) {
        let stringForField = `id: ${id} `
        // if (age !== null){
        stringForField += ` age: ${age} `
        // }
        // if (name !== null){
        stringForField += `  name: ${name} `
        // }
        // if (country !== null){
        stringForField += `  country: ${country} `
        // }
        return stringForField;
    }

    responseArray.forEach(element => {
        let partialElementArray = []
        Object.values(element).forEach(partOfEl => {
            partialElementArray.push(partOfEl);
        });
        let partOfAnswerString = stringAddField(...partialElementArray);
        resultString += partOfAnswerString + '\n';
    });

    return resultString;
}

function handlerGetUsersClick() {
    let response = fetch('get-users', {
        method: 'GET',
        header: {
            'Content-Type': 'application/json'
        }
    });
    response.then(response => response.text()).then(responseText => {
        let resultString = writeResult(responseText);
        getUsersResponse.innerText = resultString;
    });
}

function handlerDeleteUserClick() {
    let idUser = inputUserId.value;
    let response = fetch('delete-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ iduser: idUser })
    });
    response.then(response => response.text()).then(responseText => {
        let result = writeResult(responseText);
        let stringToWrite = `удалённый пользователь: ${result}`
        deleteUserResponse.innerText = stringToWrite;
    });
}

let input = document.getElementById('input1');
let button = document.getElementById('button');
let ageOutput = document.getElementById('ageOutput');
let nameOutput = document.getElementById('nameOutput');

let inputCountry = document.getElementById('inputCountry');
let buttonCountry = document.getElementById('saveCountry');
let countryOutput = document.getElementById('countryOutput');

let sendUserBtn = document.getElementById('sendUser');
let sendUserResponse = document.getElementById('sendUserResponse');

let getUsers = document.getElementById('getUsers');
let getUsersResponse = document.getElementById('getUsersResponse');

let inputUserId = document.getElementById('inputUserId');
let deleteUser = document.getElementById('deleteUser');
let deleteUserResponse = document.getElementById('deleteUsersResponse');

button.addEventListener('click', handlerClick);
buttonCountry.addEventListener('click', handlerCountryClick);
getUsers.addEventListener('click', handlerGetUsersClick);
sendUserBtn.addEventListener('click', handlerSendUserClick);
deleteUser.addEventListener('click', handlerDeleteUserClick);

function checkIsNumber(data) {
    let answer = {}

    function wirtingTypes(inputPartValue, secondCalling = false) {
        let dataNumber = +inputPartValue;
        if ((typeof dataNumber != 'number') || isNaN(dataNumber)) {
            if (secondCalling) {
                answer.type2 = 'name';
                answer.inputValue2 = inputPartValue;
                return
            }
            answer.type1 = 'name';
            answer.inputValue1 = inputPartValue;
        }
        if (typeof dataNumber == 'number' && !isNaN(dataNumber)) {
            if (secondCalling) {
                answer.type2 = 'age';
                answer.inputValue2 = inputPartValue;
                return
            }
            answer.type1 = 'age';
            answer.inputValue1 = inputPartValue;
        }
    }

    function parserTypes() {
        let parts = [];
        let localValue = '';
        for (let i of data) {
            if (i == ' ') {
                parts.push(localValue);
                localValue = '';
                continue;
            }
            localValue += i;
        }
        parts.push(localValue);
        return parts;
    }

    try {
        let parserResult = parserTypes();
        if (parserResult.length == 1) {
            wirtingTypes(parserResult[0]);
        } else {
            wirtingTypes(parserResult[0]);
            wirtingTypes(parserResult[1], true);
        }
    }
    catch {
        throw new Error('there are some problems with changing types in checkIsNumber function');
    }

    return answer;
}
