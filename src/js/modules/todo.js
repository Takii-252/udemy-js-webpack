// ----------------------------------------------------------------------
// キーワードの解説メモ
// const: 定数。一度入れたら変えられないデータを扱う（HTMLの要素など）
// let  : 変数。中身が変わる可能性のあるデータを扱う（TODOリストのデータなど）
// ----------------------------------------------------------------------

// HTMLにある「td-add-form」というクラス名のついた要素（<form>）を探してきて、定数 addform に入れる
const addform = document.querySelector(".td-add-form");
// 入力欄（input）も探してきて変数に入れる必要があります
const addInput = document.querySelector(".td-add-input");

// HTMLの「未完了リスト（Remains to do）」を表示する場所（<ul class="todos">）を取得
const todosUl = document.querySelector(".todos");

// HTMLの「完了リスト（Already done）」を表示する場所（<ul class="dones">）を取得
const donesUl = document.querySelector(".dones");


// TODOリストの全データを保存するための「配列（リスト）」を用意する
// 最初は空っぽの箱 []
// ※後で中身が増えたり減ったりするので「let」を使います
let todoData = [];

// addform（フォーム）で「送信（submit）」というイベントが起きたら、中のコードを実行する
// submitイベントは、フォームの中でエンターキーを押した時に発生します
addform.addEventListener("submit", (e) => {
    // e.preventDefault() は「イベントのデフォルトの動作（この場合はページのリロード）を防ぐ」という意味
    // これを書かないと、エンターキーを押すたびに画面が再読み込みされてしまいます
    e.preventDefault();

    // TODOの情報（内容や完了状態）をまとめたオブジェクト（データの塊）を作る
    let todoobj = {
        // addInput.value で入力された文字を取得し、.trim() で前後の余分な空白を削除する
        // 注意: ここで「addInput」がまだ定義されていないのでエラーになる可能性があります
        content: addInput.value.trim(),
        isDone: false // まだ完了していないので false（偽）にしておく
    };
    // もし（if）、入力内容（content）が存在する場合だけ保存する
    // 空文字（何も書いていない状態）は「偽（false）」とみなされるので、この中は実行されません
    if(todoobj.content){
        // 作ったTODOデータを、todoData（リスト）の最後に追加（push）する！
        // これをしないと、新しいTODOを作るたびに前のデータを忘れてしまいます
        todoData.push(todoobj);
    }
    
    // 入力欄（input）の中身を空文字（""）で上書きして、見た目を空っぽにする
    // これをしないと、送信した後も入力した文字がそのまま残ってしまいます
    addInput.value = "";
    updateLS();

})


// -------------------------------------------------------------
// function（関数）: 処理の手順をひとまとめにして名前をつけたもの
// 名前: updateLS（ローカルストレージを更新する）
// -------------------------------------------------------------
function updateLS() {
    // localStorage（ローカルストレージ）:
    // ブラウザの中にデータを保存しておける「倉庫」のような場所です。
    // ここに保存しておけば、ブラウザを一度閉じてもデータが消えません！
    
    // JSON.stringify(...):
    // 配列（todoData）などの複雑なデータはそのままでは倉庫に入れられません。
    // そのため、一度「文字（テキストデータ）」に変換してから保存します。
    // "myTodo" というラベル（鍵）をつけて保存しています。
    localStorage.setItem("myTodo", JSON.stringify(todoData));   
}

// -------------------------------------------------------------
// 関数: ブラウザに保存されたTODOリストを取り出す
// -------------------------------------------------------------
function getTodoData() {
    // localStorage.getItem("myTodo"):
    // 倉庫から "myTodo" というラベルのついたデータ（文字）を取り出してきます。
    
    // JSON.parse(...):
    // 取り出したのはただの「文字」なので、JavaScriptで使える「配列（リスト）」に戻します。
    // 「翻訳して戻す」作業です。（stringifyの逆）
    return JSON.parse(localStorage.getItem("myTodo")); 
}

// -------------------------------------------------------------
// function: TODOリストの「見た目（HTML）」を作る手順
// 引数（todo）: 「内容:掃除, 完了:false」などのデータが一つ渡される
// -------------------------------------------------------------
function createTodoElement(todo) {
    // 1. <li>タグ（リストの項目）を新しく作る
    // （まだ画面には表示されず、メモリの中に浮いている状態）
    // 1. <li>タグ（リストの項目）を新しく作る
    const todoItem = document.createElement("li");
    // "td-item" というクラス名をつけることで、CSSの「横並びレイアウト（flex）」などが適用されます
    todoItem.classList.add("td-item");
    
    // 2. <p>タグ（段落・文字を表示する場所）を新しく作る
    const todoContent = document.createElement("p");
    // "td-content" というクラス名をつけて、文字の大きさや幅などのデザインを適用します
    todoContent.classList.add("td-content");
    
    // 3. 作った<p>の中に、TODOの内容（文字）を入れる
    // todo.content には「掃除」などの文字が入っています
    todoContent.textContent = todo.content;
    
    // 4. マトリョーシカのように合体させる
    // <li> の中に <p> を入れる（子要素として追加）
    // 結果: <li> <p>掃除</p> </li> という形になる
    todoItem.appendChild(todoContent);

    // -------------------------------------------------------------
    // ここから下は「ボタン」を作る作業です
    // -------------------------------------------------------------
    // ボタンをまとめる箱（div）を作る
    const btnContainer = document.createElement("div");
    // ボタン用の箱にもクラスをつけて、ボタン同士の間隔などを調整します
    btnContainer.classList.add("td-btn-container");
    
    // 画像ボタン（img）のベースを作る
    const btn = document.createElement("img");
    btn.classList.add("td-btn"); // デザイン用のクラスをつける
    
    // ボタンをコピーして、もう一つボタン（UPボタン用）を作る
    // cloneNode(false): 中身はコピーせず、ガワだけ複製する
    const upBtn = btn.cloneNode(false);
    
    // UPボタンの画像を設定する
    upBtn.setAttribute("src", "./images/todo_button/up.png");

    // -------------------------------------------------------------
    // まだ完了していない（Remains）か、完了済み（Done）かで出し分ける
    // -------------------------------------------------------------
    // -------------------------------------------------------------
    // まだ完了していない（Remains）か、完了済み（Done）かで出し分ける
    // -------------------------------------------------------------
    if(!todo.isDone){
        // ボタンに「役割」を示すクラス名をつける
        // これをつけておくと、後で「どのボタンが押されたか」を判断するのに使えます
        upBtn.classList.add("edit-btn");   // 編集ボタン
        btn.classList.add("isDone-btn");   // 完了ボタン

        // 【未完了の場合】
        btn.setAttribute("src", "./images/todo_button/ok.png"); // 「OK（完了）」ボタンにする
        
        // 箱にボタンを入れる
        btnContainer.appendChild(btn);
        btnContainer.appendChild(upBtn);
        todoItem.appendChild(btnContainer); // リスト項目にボタン箱を入れる
        
        // 最後に、画面上の「未完了リスト（todosUl）」の場所に表示する！
        todosUl.appendChild(todoItem);
    }else{
        // 完了済みの場合も同様に役割クラスをつける
        upBtn.classList.add("undo-btn");     // 元に戻すボタン
        btn.classList.add("delete-btn");     // 削除ボタン

        // 【完了済みの場合】
        btn.setAttribute("src", "./images/todo_button/cancel.png"); // 「キャンセル（戻す）」ボタンにする
        
        // 箱にボタンを入れる
        btnContainer.appendChild(btn);
        btnContainer.appendChild(upBtn);
        todoItem.appendChild(btnContainer);
        
        // 画面上の「完了リスト（donesUl）」の場所に表示する！
        donesUl.appendChild(todoItem);
    }
}

createTodoElement({content: "remains to do", isDone: false});
createTodoElement({content: "already done", isDone: true});