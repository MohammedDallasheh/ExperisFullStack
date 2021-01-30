let arr;
window.onload = () => {
    arr = JSON.parse(localStorage.getItem("memos"));
    if (!arr) {
        arr = [];
    }
    for (const object of arr) {
        showMemo(object);
    }
};
class Memo {
    constructor(id, date, time, body) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.body = body;
    }
}
function getIDandIncrease() {
    let countObj = Number(localStorage.getItem("countObj"));
    if (!countObj) {
        countObj = 1;
    }
    else {
        countObj++;
    }
    localStorage.setItem("countObj", String(countObj));
    return countObj;
}
function createMemo() {
    let dateInput = document.querySelector("#dateInput").value;
    let timeInput = document.querySelector("#timeInput").value;
    let textArea = document.querySelector("#textarea").value;
    let obj = new Memo(getIDandIncrease(), dateInput, timeInput, textArea);
    arr.push(obj);
    localStorage.setItem('memos', JSON.stringify(arr));
    showMemo(obj);
}
function showMemo(obj) {
    let containerEl = document.querySelector(".container");
    let memoDiv = document.createElement("div");
    memoDiv.classList.add("memo");
    memoDiv.id = obj.id;
    memoDiv.innerText = `\n\n${obj.body} \n ${obj.date} \n ${obj.time}`;
    let xBtn = document.createElement("span");
    xBtn.innerText = "x";
    xBtn.classList.add("x-button");
    memoDiv.prepend(xBtn);
    containerEl.append(memoDiv);
    addListenersDiv(memoDiv);
    addListenerButton(xBtn);
}
function addListenersDiv(div) {
    div.addEventListener("mouseover", function () {
        this.children[0].style.display = "inline";
    });
    div.addEventListener("mouseout", function () {
        this.children[0].style.display = "none";
    });
}
function addListenerButton(btn) {
    btn.addEventListener("click", function () {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == this.parentNode.id) {
                arr.splice(i, 1);
                localStorage.setItem('memos', JSON.stringify(arr));
                this.parentNode.remove();
            }
        }
    });
}
function clearAll() {
    localStorage.clear();
    arr = [];
    let containerEl = document.querySelector(".container");
    while (containerEl.firstChild) {
        containerEl.removeChild(containerEl.firstChild);
    }
}
export {};
