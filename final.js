let productCount = 0
let orderCount = 0
let userCount = 0
let categoryId = 0
let userId = 0
let orderId = 0

let editProductRow = null
let editCategoryRow = null
let editOrderRow = null
let editUserRow = null

let categoryCounts = {}  

let categoriesInOverview = []

function showSection(sectionId) {
    if(sectionId === 'settings') {
        let sections = document.querySelectorAll('.section')
        for(let i = 0; i < sections.length; i++) {
            sections[i].classList.remove('active-section')
        }
        
        document.getElementById('settings').classList.add('active-section')
        
        return
    }
    
    let sections = document.querySelectorAll('.section')
    for(let i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active-section')
    }
    
    document.getElementById(sectionId).classList.add('active-section')
    
    let menuItems = document.querySelectorAll('.sidebar li')
    for(let i = 0; i < menuItems.length; i++) {
        menuItems[i].classList.remove('active')
    }
    
    if(sectionId === 'dashboard') menuItems[0].classList.add('active')
    if(sectionId === 'products') menuItems[1].classList.add('active')
    if(sectionId === 'categories') menuItems[2].classList.add('active')
    if(sectionId === 'orders') menuItems[3].classList.add('active')
    if(sectionId === 'users') menuItems[4].classList.add('active')
    
    if(sectionId === 'orders') {
        updateProductDropdown()
    }
}

function addProduct() {
    let name = document.getElementById("name").value
    let price = document.getElementById("price").value
    let qty = document.getElementById("qty").value
    let category = document.getElementById("category").value
    let desc = document.getElementById("desc").value

    if(name === "" || price === "" || qty === "" || category === "" || desc === "") {
        alert("Please fill all fields")
        return
    }

    
    let table = document.getElementById("productTable")
    let overviewTable = document.getElementById("productOverviewTable")

    if(editProductRow !== null) {
        let oldCategory = editProductRow.cells[4].innerText
        
        editProductRow.cells[1].innerText = name
        editProductRow.cells[2].innerText = "$" + price
        editProductRow.cells[3].innerText = qty
        editProductRow.cells[4].innerText = category
        editProductRow.cells[5].innerText = desc
        
        let rowId = editProductRow.cells[0].innerText
        for(let i = 0; i < overviewTable.rows.length; i++) {
            if(overviewTable.rows[i].cells[0].innerText === rowId) {
                overviewTable.rows[i].cells[1].innerText = name
                overviewTable.rows[i].cells[2].innerText = "$" + price
                overviewTable.rows[i].cells[3].innerText = qty
                overviewTable.rows[i].cells[4].innerText = category
                overviewTable.rows[i].cells[5].innerText = desc
                break
            }
        }
        
        if(oldCategory !== category) {
            categoryCounts[oldCategory]--
            if(categoryCounts[oldCategory] === 0) {
                removeCategoryFromOverview(oldCategory)
            }
            
            categoryCounts[category]++
            if(categoryCounts[category] === 1) {
                addCategoryToOverview(category)
            }
        }
        
        editProductRow = null
        document.getElementById("productBtn").innerText = "Add Product"
        updateCategoryCount()
        clearProductForm()
        alert("Product updated successfully")
        return
    }

    productCount++
    document.getElementById("productCount").innerText = productCount
    
    let row = table.insertRow()
    row.insertCell(0).innerText = productCount
    row.insertCell(1).innerText = name
    row.insertCell(2).innerText = "$" + price
    row.insertCell(3).innerText = qty
    row.insertCell(4).innerText = category
    row.insertCell(5).innerText = desc
    
    let actions = row.insertCell(6)
    actions.innerHTML = "<button class='action-btn edit-btn' onclick='editProduct(this)'>Edit</button>" +
                        "<button class='action-btn delete-btn' onclick='deleteProduct(this)'>Delete</button>"
    
    let overviewRow = overviewTable.insertRow()
    overviewRow.insertCell(0).innerText = productCount
    overviewRow.insertCell(1).innerText = name
    overviewRow.insertCell(2).innerText = "$" + price
    overviewRow.insertCell(3).innerText = qty
    overviewRow.insertCell(4).innerText = category
    overviewRow.insertCell(5).innerText = desc
    
    categoryCounts[category]++
    if(categoryCounts[category] === 1) {
        addCategoryToOverview(category)
    }
    
    updateCategoryCount()
    clearProductForm()
    alert("Product added successfully")
}

function editProduct(btn) {
    editProductRow = btn.parentNode.parentNode
    let currentPrice = editProductRow.cells[2].innerText.replace("$", "")
    
    document.getElementById("name").value = editProductRow.cells[1].innerText
    document.getElementById("price").value = currentPrice
    document.getElementById("qty").value = editProductRow.cells[3].innerText
    document.getElementById("category").value = editProductRow.cells[4].innerText
    document.getElementById("desc").value = editProductRow.cells[5].innerText
    
    document.getElementById("productBtn").innerText = "Update Product"
    showSection('products')
}

function deleteProduct(btn) {
    if(confirm("Are you sure you want to delete this product?")) {
        let row = btn.parentNode.parentNode
        let overviewTable = document.getElementById("productOverviewTable")
        let category = row.cells[4].innerText
        let rowId = row.cells[0].innerText
        
        row.remove()
        
        for(let i = 0; i < overviewTable.rows.length; i++) {
            if(overviewTable.rows[i].cells[0].innerText === rowId) {
                overviewTable.deleteRow(i)
                break
            }
        }
        
        productCount--
        document.getElementById("productCount").innerText = productCount
        
        categoryCounts[category]--
        if(categoryCounts[category] === 0) {
            removeCategoryFromOverview(category)
        }
        
        updateCategoryCount()
        
        if(editProductRow === row) {
            editProductRow = null
            document.getElementById("productBtn").innerText = "Add Product"
            clearProductForm()
        }
        
        alert("Product deleted successfully")
    }
}

function clearProductForm() {
    document.getElementById("name").value = ""
    document.getElementById("price").value = ""
    document.getElementById("qty").value = ""
    document.getElementById("category").value = ""
    document.getElementById("desc").value = ""
}

function addCategory() {
    let categoryName = document.getElementById("categoryName").value
    
    if(categoryName === "") {
        alert("Please enter category name")
        return
    }
    
    if(categoryCounts[categoryName] !== undefined) {
        alert("Category already exists")
        return
    }
    
    categoryCounts[categoryName] = 0
    
    let select = document.getElementById("category")
    let option = document.createElement("option")
    option.value = categoryName
    option.text = categoryName
    select.add(option)
    
    let table = document.getElementById("categoryTable")
    categoryId++
    let row = table.insertRow()
    row.insertCell(0).innerText = categoryId
    row.insertCell(1).innerText = categoryName
    
    let actions = row.insertCell(2)
    actions.innerHTML = "<button class='action-btn edit-btn' onclick='editCategory(this)'>Edit</button>" +
                        "<button class='action-btn delete-btn' onclick='deleteCategory(this)'>Delete</button>"
    
    document.getElementById("categoryName").value = ""
    alert("Category added successfully")
}

function editCategory(btn) {
    let row = btn.parentNode.parentNode
    let oldName = row.cells[1].innerText
    
    let newName = prompt("Edit category name:", oldName)
    if(newName && newName !== oldName) {
        if(categoryCounts[newName] !== undefined) {
            alert("Category name already exists")
            return
        }
        
        categoryCounts[newName] = categoryCounts[oldName]
        delete categoryCounts[oldName]
        
        let select = document.getElementById("category")
        for(let i = 0; i < select.options.length; i++) {
            if(select.options[i].value === oldName) {
                select.options[i].value = newName
                select.options[i].text = newName
                break
            }
        }
        
        updateProductsCategory(oldName, newName)
        
        if(categoriesInOverview.includes(oldName)) {
            let index = categoriesInOverview.indexOf(oldName)
            categoriesInOverview[index] = newName
            
            let catTable = document.getElementById("categoryOverviewTable")
            for(let i = 0; i < catTable.rows.length; i++) {
                if(catTable.rows[i].cells[1].innerText === oldName) {
                    catTable.rows[i].cells[1].innerText = newName
                    break
                }
            }
        }
        
        row.cells[1].innerText = newName
        alert("Category updated successfully")
    }
}

function deleteCategory(btn) {
    if(confirm("Are you sure you want to delete this category?")) {
        let row = btn.parentNode.parentNode
        let categoryName = row.cells[1].innerText
        
        if(categoryCounts[categoryName] > 0) {
            alert("Cannot delete category with existing products")
            return
        }
        
        delete categoryCounts[categoryName]
        
        let select = document.getElementById("category")
        for(let i = 0; i < select.options.length; i++) {
            if(select.options[i].value === categoryName) {
                select.remove(i)
                break
            }
        }
        
        if(categoriesInOverview.includes(categoryName)) {
            removeCategoryFromOverview(categoryName)
        }
        
        row.remove()
        updateCategoryIds()
        alert("Category deleted successfully")
    }
}

function updateProductsCategory(oldName, newName) {
    let productTable = document.getElementById("productTable")
    let overviewTable = document.getElementById("productOverviewTable")
    
    for(let i = 0; i < productTable.rows.length; i++) {
        if(productTable.rows[i].cells[4].innerText === oldName) {
            productTable.rows[i].cells[4].innerText = newName
        }
    }
    
    for(let i = 0; i < overviewTable.rows.length; i++) {
        if(overviewTable.rows[i].cells[4].innerText === oldName) {
            overviewTable.rows[i].cells[4].innerText = newName
        }
    }
}

function updateCategoryIds() {
    let table = document.getElementById("categoryTable")
    for(let i = 0; i < table.rows.length; i++) {
        table.rows[i].cells[0].innerText = i + 1
    }
    categoryId = table.rows.length
}

function addOrder() {
    let orderName = document.getElementById("orderName").value
    let qty = document.getElementById("orderQty").value
    let date = document.getElementById("orderDate").value
    let product = document.getElementById("orderProduct").value
    
    if(orderName === "" || qty === "" || date === "" || product === "") {
        alert("Please fill all fields")
        return
    }
    
    let table = document.getElementById("orderTable")
    let overviewTable = document.getElementById("orderOverviewTable")
    
    if(editOrderRow !== null) {
        editOrderRow.cells[1].innerText = orderName
        editOrderRow.cells[2].innerText = qty
        editOrderRow.cells[3].innerText = date
        editOrderRow.cells[4].innerText = product
        
        let rowId = editOrderRow.cells[0].innerText
        for(let i = 0; i < overviewTable.rows.length; i++) {
            if(overviewTable.rows[i].cells[0].innerText === rowId) {
                overviewTable.rows[i].cells[1].innerText = orderName
                overviewTable.rows[i].cells[2].innerText = qty
                overviewTable.rows[i].cells[3].innerText = date
                overviewTable.rows[i].cells[4].innerText = product
                break
            }
        }
        
        editOrderRow = null
        alert("Order updated successfully")
    } else {
        orderId++
        orderCount++
        document.getElementById("orderCount").innerText = orderCount
        
        let row = table.insertRow()
        row.insertCell(0).innerText = orderId
        row.insertCell(1).innerText = orderName
        row.insertCell(2).innerText = qty
        row.insertCell(3).innerText = date
        row.insertCell(4).innerText = product
        
        let actions = row.insertCell(5)
        actions.innerHTML = "<button class='action-btn edit-btn' onclick='editOrder(this)'>Edit</button>" +
                            "<button class='action-btn delete-btn' onclick='deleteOrder(this)'>Delete</button>"
        
        let overviewRow = overviewTable.insertRow()
        overviewRow.insertCell(0).innerText = orderId
        overviewRow.insertCell(1).innerText = orderName
        overviewRow.insertCell(2).innerText = qty
        overviewRow.insertCell(3).innerText = date
        overviewRow.insertCell(4).innerText = product
        
        alert("Order added successfully")
    }
    
    clearOrderForm()
}

function editOrder(btn) {
    editOrderRow = btn.parentNode.parentNode
    
    document.getElementById("orderName").value = editOrderRow.cells[1].innerText
    document.getElementById("orderQty").value = editOrderRow.cells[2].innerText
    document.getElementById("orderDate").value = editOrderRow.cells[3].innerText
    document.getElementById("orderProduct").value = editOrderRow.cells[4].innerText
    
    showSection('orders')
}

function deleteOrder(btn) {
    if(confirm("Are you sure you want to delete this order?")) {
        let row = btn.parentNode.parentNode
        let overviewTable = document.getElementById("orderOverviewTable")
        let rowId = row.cells[0].innerText
        
        row.remove()
        
        for(let i = 0; i < overviewTable.rows.length; i++) {
            if(overviewTable.rows[i].cells[0].innerText === rowId) {
                overviewTable.deleteRow(i)
                break
            }
        }
        
        orderCount--
        document.getElementById("orderCount").innerText = orderCount
        
        if(editOrderRow === row) {
            editOrderRow = null
            clearOrderForm()
        }
        
        alert("Order deleted successfully")
    }
}

function clearOrderForm() {
    document.getElementById("orderName").value = ""
    document.getElementById("orderQty").value = ""
    document.getElementById("orderDate").value = ""
    document.getElementById("orderProduct").value = ""
}

function updateProductDropdown() {
    let select = document.getElementById("orderProduct")
    select.innerHTML = "<option value=''>Select product</option>"
    
    let productTable = document.getElementById("productTable")
    for(let i = 0; i < productTable.rows.length; i++) {
        let option = document.createElement("option")
        option.value = productTable.rows[i].cells[1].innerText
        option.text = productTable.rows[i].cells[1].innerText
        select.add(option)
    }
}

function addUser() {
    let userName = document.getElementById("userName").value
    let email = document.getElementById("userEmail").value
    let phone = document.getElementById("userPhone").value
    
    if(userName === "" || email === "" || phone === "") {
        alert("Please fill all fields")
        return
    }
    
    let table = document.getElementById("userTable")
    let overviewTable = document.getElementById("userOverviewTable")
    
    if(editUserRow !== null) {
        editUserRow.cells[1].innerText = userName
        editUserRow.cells[2].innerText = email
        editUserRow.cells[3].innerText = phone
        
        let rowId = editUserRow.cells[0].innerText
        for(let i = 0; i < overviewTable.rows.length; i++) {
            if(overviewTable.rows[i].cells[0].innerText === rowId) {
                overviewTable.rows[i].cells[1].innerText = userName
                overviewTable.rows[i].cells[2].innerText = email
                overviewTable.rows[i].cells[3].innerText = phone
                break
            }
        }
        
        editUserRow = null
        alert("User updated successfully")
    } else {
        userId++
        userCount++
        document.getElementById("userCount").innerText = userCount
        
        let row = table.insertRow()
        row.insertCell(0).innerText = userId
        row.insertCell(1).innerText = userName
        row.insertCell(2).innerText = email
        row.insertCell(3).innerText = phone
        
        let actions = row.insertCell(4)
        actions.innerHTML = "<button class='action-btn edit-btn' onclick='editUser(this)'>Edit</button>" +
                            "<button class='action-btn delete-btn' onclick='deleteUser(this)'>Delete</button>"
        
        let overviewRow = overviewTable.insertRow()
        overviewRow.insertCell(0).innerText = userId
        overviewRow.insertCell(1).innerText = userName
        overviewRow.insertCell(2).innerText = email
        overviewRow.insertCell(3).innerText = phone
        
        alert("User added successfully")
    }
    
    clearUserForm()
}

function editUser(btn) {
    editUserRow = btn.parentNode.parentNode
    
    document.getElementById("userName").value = editUserRow.cells[1].innerText
    document.getElementById("userEmail").value = editUserRow.cells[2].innerText
    document.getElementById("userPhone").value = editUserRow.cells[3].innerText
    
    showSection('users')
}

function deleteUser(btn) {
    if(confirm("Are you sure you want to delete this user?")) {
        let row = btn.parentNode.parentNode
        let overviewTable = document.getElementById("userOverviewTable")
        let rowId = row.cells[0].innerText
        
        row.remove()
        
        for(let i = 0; i < overviewTable.rows.length; i++) {
            if(overviewTable.rows[i].cells[0].innerText === rowId) {
                overviewTable.deleteRow(i)
                break
            }
        }
        
        userCount--
        document.getElementById("userCount").innerText = userCount
        
        if(editUserRow === row) {
            editUserRow = null
            clearUserForm()
        }
        
        updateUserIds()
        alert("User deleted successfully")
    }
}

function clearUserForm() {
    document.getElementById("userName").value = ""
    document.getElementById("userEmail").value = ""
    document.getElementById("userPhone").value = ""
}

function updateUserIds() {
    let table = document.getElementById("userTable")
    for(let i = 0; i < table.rows.length; i++) {
        table.rows[i].cells[0].innerText = i + 1
    }
    userId = table.rows.length
}

function addCategoryToOverview(categoryName) {
    if(categoriesInOverview.includes(categoryName)) return
    
    let table = document.getElementById("categoryOverviewTable")
    let row = table.insertRow()
    row.insertCell(0).innerText = table.rows.length
    row.insertCell(1).innerText = categoryName
    categoriesInOverview.push(categoryName)
    updateCategoryCount()
}

function removeCategoryFromOverview(categoryName) {
    let table = document.getElementById("categoryOverviewTable")
    for(let i = 0; i < table.rows.length; i++) {
        if(table.rows[i].cells[1].innerText === categoryName) {
            table.deleteRow(i)
            
            let index = categoriesInOverview.indexOf(categoryName)
            if(index !== -1) {
                categoriesInOverview.splice(index, 1)
            }
            break
        }
    }
    updateCategoryCount()
}

function updateCategoryCount() {
    let count = 0
    for(let cat in categoryCounts) {
        if(categoryCounts[cat] > 0) {
            count++
        }
    }
    document.getElementById("categoryCount").innerText = count
}

window.onload = function() {
    productCount = 0
    orderCount = 0
    userCount = 0
    categoryId = 0
    userId = 0
    orderId = 0
    
    categoryCounts = {}  
    
    categoriesInOverview = []
    
    let categorySelect = document.getElementById("category")
    categorySelect.innerHTML = "<option value=''>Select category</option>"
    
    document.getElementById("productCount").innerText = "0"
    document.getElementById("orderCount").innerText = "0"
    document.getElementById("categoryCount").innerText = "0"
    document.getElementById("userCount").innerText = "0"
    
    let today = new Date().toISOString().split('T')[0]
    if(document.getElementById("orderDate")) {
        document.getElementById("orderDate").value = today
    }
    
    showSection('dashboard')
}

