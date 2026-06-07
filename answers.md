# Câu A1 (5đ) — DOM Tree
1. Sơ đồ cây DOM Tree
 - Khi trình duyệt đọc đoạn mã HTML của bạn, nó sẽ chuyển đổi các thẻ thành các đối tượng dạng nút (nodes) và sắp xếp chúng theo cấu trúc cây phân cấp (Cha - Con) như sau:
```
                 document
                     │
                  <div#app>
           ┌─────────┴─────────┐
       <header>             <main>
     ┌─────┴─────┐       ┌─────┴──────────┐
   <h1>        <nav>  <form#todoForm>  <ul#todoList>
                 │       ┌─────┴─────┐    ┌────┴────┐
                (a)    <input>   <button> (li)     (li)
              ┌──┼──┐
             <a><a><a>
```
2. Các câu lệnh querySelector theo yêu cầu
 - JavaScript cung cấp hai phương thức chính để tìm kiếm phần tử là document.querySelector() (trả về 1 phần tử đầu tiên tìm thấy) và document.querySelectorAll() (trả về một danh sách tất cả các phần tử trùng khớp).
 - Code:
 ```
 // 1. Chọn thẻ <h1>
const heading = document.querySelector("h1");

// 2. Chọn input trong form
const todoInput = document.querySelector("#todoForm input"); 
// Hoặc đơn giản nếu ID là duy nhất: document.querySelector("#todoInput");

// 3. Chọn tất cả .todo-item (Dùng ALL vì yêu cầu chọn "tất cả")
const todoItems = document.querySelectorAll(".todo-item");

// 4. Chọn link đang active
const activeLink = document.querySelector("nav a.active");

// 5. Chọn <li> đầu tiên trong #todoList
const firstTodo = document.querySelector("#todoList li:first-child");
// Hoặc ngắn gọn: document.querySelector("#todoList li"); (querySelector luôn tự lấy thằng đầu tiên)

// 6. Chọn tất cả <a> bên trong <nav> (Dùng ALL)
const navLinks = document.querySelectorAll("nav a");
```

# Câu A2 (5đ) — innerHTML vs textContent
1. Phân biệt innerHTML vs innerText vs textContent
 - innerHTML: Lấy/ghi cả văn bản và thẻ HTML. Trình duyệt sẽ biên dịch chuỗi thành giao diện.
 - innerText: Chỉ lấy/ghi văn bản hiển thị trên màn hình (bỏ qua phần tử bị ẩn bởi CSS display: none). Hiệu năng vừa phải.
 - textContent: Chỉ lấy/ghi văn bản thô của tất cả các node (kể cả phần tử ẩn). Nhanh nhất và an toàn nhất cho text.
 - Ví dụ khi nào dùng:
    + Dùng innerHTML khi cần chèn một khối giao diện mới do bạn tự viết (Ví dụ: box.innerHTML = "<div><p>Hello</p></div>").
    + Dùng textContent khi hiển thị thông tin dạng chữ do người dùng nhập vào (Ví dụ: Tên user, số lượng thông báo).

2. Tại sao innerHTML gây lỗ hổng XSS?
 - Vì innerHTML sẽ thực thi trực tiếp bất kỳ đoạn mã lệnh nào nằm trong chuỗi truyền vào. Nếu kẻ tấn công cố tình nhập mã độc, 
 - trình duyệt sẽ chạy mã đó ngay lập tức, dẫn đến lộ thông tin tài khoản (Cookie, Token).
 - Cách sửa đổi code để an toàn
    + Cách 1: Thay bằng textContent (Khuyên dùng cho văn bản thô) Biến mọi ký tự lạ thành văn bản thuần, trình duyệt sẽ không thể thực thi lệnh.
```
    const userInput = document.querySelector("#search").value;
    // SỬA: Thay innerHTML bằng textContent
    document.querySelector("#result").textContent = userInput;
``` 
    + Cách 2: Dùng thư viện lọc (Nếu bắt buộc phải nhận HTML từ user)
    Sử dụng thư viện DOMPurify để tự động rà quét và xóa bỏ các đoạn mã độc trước khi gán.
```
const userInput = document.querySelector("#search").value;
// SỬA: Làm sạch dữ liệu trước khi gán vào innerHTML
document.querySelector("#result").innerHTML = DOMPurify.sanitize(userInput);
```
# Câu A3 (5đ) — Event Bubbling
1. Dự đoán Output
 - Trường hợp 1: Khi ĐÓNG comment (Mặc định) khi bạn click vào <button id="btn">, sự kiện sẽ bắt đầu kích hoạt từ phần tử trong cùng (Target), sau đó "sủi bọt" (lan truyền) ngược lên các phần tử cha bên ngoài theo thứ tự:
    BUTTON
    INNER
    OUTER

 - Trường hợp 2: Khi MỞ comment e.stopPropagation(); phương thức e.stopPropagation() có nhiệm vụ ngăn chặn không cho sự kiện tiếp tục lan truyền (sủi bọt) lên các phần tử cha phía trên nữa. Do đó, sự kiện bị chặn đứng ngay tại Button:
   BUTTON

2. Giải thích cơ chế Event Bubbling
 
 - Mặc định trong JavaScript, khi một sự kiện xảy ra trên một phần tử, trình duyệt sẽ thực hiện quá trình xử lý qua các giai đoạn, trong đó có Event Bubbling.
 - Sự kiện sẽ chạy từ phần tử đích (nơi bạn click) rồi dịch chuyển thẳng lên trên Node tổ tiên (thường là <body> và document). Do #btn nằm trong #inner, và #inner lại nằm trong #outer, nên việc click vào nút bấm cũng đồng nghĩa với việc bạn đang click vào các thẻ div bọc nó.
 - Khi không có stopPropagation(): Trình duyệt gọi lần lượt các hàm xử lý sự kiện của #btn $\rightarrow$ #inner $\rightarrow$ #outer.
 - Khi có stopPropagation(): Hàm xử lý tại #btn chạy xong $\rightarrow$ gặp lệnh chặn $\rightarrow$ quá trình sủi bọt bị hủy bỏ lập tức, các phần tử cha phía trên hoàn toàn "vô cảm" với cú click này.

 # Câu C1 (8đ) — Debug DOM Code

1. Lỗi const countDisplay (Dòng 23): Biến này được khai báo bằng const, nhưng trong sự kiện #resetBtn, bạn lại gán lại giá trị cho nó (countDisplay = count;). Điều này sẽ gây ra lỗi TypeError: Assignment to constant variable..
 -> Sửa: Phải tác động vào thuộc tính .textContent hoặc .innerHTML của nó.

2. Lỗi countDisplay = count; (Dòng 23):  Ngoài việc sai từ khóa const, dòng này đang ghi đè biến DOM thành một con số, chứ không phải cập nhật giao diện.
 -> Sửa: Đổi thành countDisplay.textContent = count;.

3. Lỗi addEventListener("onclick", ...) (Dòng 16): Khi dùng phương thức addEventListener, tên sự kiện không có tiền tố on. Sử dụng "onclick" sẽ khiến sự kiện không bao giờ được kích hoạt.
 -> Sửa: Đổi thành "click".

4. Lỗi historyList.innerHTML = null; (Dòng 24): Dù gán null có thể hoạt động nhờ JS tự ép kiểu thành chuỗi "null" (hoặc xóa trắng tùy trình duyệt), nhưng đây là bad practice vì nó có thể tạo ra text node không mong muốn hoặc gây lỗi logic.
 -> Sửa: Đổi thành chuỗi rỗng "".

5. Lỗi item.remove; (Dòng 34): remove là một phương thức (method) của DOM element. Thiếu cặp dấu ngoặc đơn () khiến hàm không được thực thi.
 -> Sửa: Đổi thành item.remove();.

6. Lỗi Kiểu dữ liệu khi Load từ localStorage (Dòng 44): localStorage.getItem("count") luôn trả về một chuỗi (String) hoặc null. Nếu không ép kiểu về Number, khi bạn bấm nút incrementBtn (count++), JavaScript sẽ thực hiện phép toán trên chuỗi hoặc lỗi logic (ví dụ "0"++ thành 1 nhưng nếu cộng chuỗi ở đoạn khác sẽ sinh lỗi). Đặc biệt nếu localStorage trống, count sẽ là null, khi count++ sẽ biến thành 1, nhưng hiển thị ban đầu lại là null.
 -> Sửa: Sử dụng parseInt() hoặc toán tử + và đưa ra giá trị mặc định || 0.

7. Lỗi Khôi phục giao diện History List (Dòng 45): Ở sự kiện beforeunload, bạn có lưu historyList.innerHTML vào localStorage. Tuy nhiên, ở sự kiện load, bạn hoàn toàn quên khôi phục danh sách này lên giao diện.
 -> Sửa: Thêm historyList.innerHTML = localStorage.getItem("history") || "";.

8. Lỗi Mất Event Listener của History Item cũ sau khi Load (Hệ quả của lỗi 7): Khi bạn khôi phục historyList.innerHTML bằng chuỗi HTML từ localStorage, các thẻ <li> cũ sẽ hiện lên, nhưng các Event Listener (click để xóa) gắn bằng JS trước đó đã bị mất hoàn toàn.
-> Sửa: Thay vì xóa bằng this trong hàm listener cũ, ta nên dùng Event Delegation (Ủy quyền sự kiện) trên historyList để bắt sự kiện click của các thẻ li (cả cũ lẫn mới).

# Câu C2 (7đ) — Performance

1. Tại sao gắn 1000 Event riêng lẻ là BAD PRACTICE?
 - Tốn bộ nhớ: Trình duyệt phải tạo và lưu trữ 1000 đối tượng sự kiện riêng biệt, gây chậm, lag máy (đặc biệt là mobile).
 - Rò rỉ bộ nhớ (Memory Leak): Khi xóa phần tử, nếu quên gỡ event (removeEventListener), bộ nhớ vẫn bị chiếm dụng.
 - Khó bảo trì: Khi thêm phần tử mới bằng JS, bạn lại phải viết code gắn lại event cho chúng.
 - Event Delegation giải quyết thế nào: 
    + Dựa vào cơ chế Event Bubbling (Nổi bọt sự kiện): Sự kiện từ phần tử con sẽ lan truyền ngược lên các phần tử cha.
    + Ta chỉ cần gắn 1 event duy nhất lên thằng cha bọc ngoài, rồi dùng e.target để kiểm tra xem chính xác thằng con nào được click.

2. Refactor với DocumentFragment
 - Code tối ưu (Chỉ 1 lần Reflow):
````

// 1. Tạo mảnh vỡ DOM ảo trong bộ nhớ
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
    const div = document.createElement("div");
    div.textContent = `Item ${i}`;
    
    // 2. Thêm vào fragment (chỉ xử lý trong RAM, 0 lần Reflow)
    fragment.appendChild(div);
}

// 3. Đẩy toàn bộ vào DOM thật (Chỉ 1 lần Reflow duy nhất)
document.body.appendChild(fragment);
```
 - Tại sao nhanh hơn?
    + Không nằm trên DOM thật: DocumentFragment là một vùng nhớ tạm thời, độc lập với giao diện đang hiển thị.
    + Thao tác ngầm (In-memory): Vòng lặp 1000 lần diễn ra hoàn toàn trong RAM, trình duyệt không cần tính toán lại kích thước/vị trí (Reflow) hay vẽ lại màn hình (Repaint) liên tục.
    + Gộp thay đổi: Khi append fragment vào body, trình duyệt chỉ cần xử lý gom toàn bộ 1000 phần tử cùng một lúc, giảm tải tối đa cho CPU.