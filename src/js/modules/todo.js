// HTMLにある「td-add-form」というクラス名のついた要素（<form>）を探してきて、定数 addform に入れる
const addform = document.querySelector(".td-add-form");
// 入力欄（input）も探してきて変数に入れる必要があります
const addInput = document.querySelector(".td-add-input");


// TODOリストの全データを保存するための「配列（リスト）」を用意する
// 最初は空っぽの箱 []
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
// 関数: TODOリストの内容をブラウザに保存する
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