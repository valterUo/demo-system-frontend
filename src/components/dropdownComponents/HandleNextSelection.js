export const handleNextSelection = (relation, buildQueryAndChangeDropdown) => {
    switch (relation) {
      case 'CONTAINS':
        buildQueryAndChangeDropdown(relation, [["Order constant", "Order variable"], ["Product constant", "Product variable"]])
        return true
      case 'KNOWS':
        buildQueryAndChangeDropdown(relation, [["Ordered", "Customer constant", "Customer variable"], ["Ordered", "Customer constant", "Customer variable"]])
        return true
      case 'CAN_PAY_PRODUCT':
        buildQueryAndChangeDropdown(relation, [["Product constant", "Product variable"], ["Customer constant", "Customer variable"]])
        return true
      case 'CAN_PAY_ORDER':
        buildQueryAndChangeDropdown(relation, [["Order constant", "Order variable"], ["Customer constant", "Customer variable"]])
        return true
      case 'COMPARE':
        buildQueryAndChangeDropdown(relation, [["Price", "Credit_limit", "Customer_id", "Integer constant", "Integer variable"], ["Price", "Credit_limit", "Customer_id", "Integer constant", "Integer variable"]])
        return true
      case 'EQUALS':
        buildQueryAndChangeDropdown(relation, [["Price", "Credit_limit", "Customer_id", "Customer_name", "Integer constant", "Integer variable", "String constant", "String variable"],
        ["Price", "Credit_limit", "Customer_id", "Customer_name", "Integer constant", "Integer variable", "String constant", "String variable"]])
        return true
      case 'Ordered':
        buildQueryAndChangeDropdown(relation, ["Order constant", "Order variable"])
        return true
      case 'Product_id':
        buildQueryAndChangeDropdown(relation, ["Product constant", "Product variable"])
        return true
      case 'Customer_name':
        buildQueryAndChangeDropdown(relation, ["Ordered", "Customer constant", "Customer variable"])
        return true
      case 'Product_name':
        buildQueryAndChangeDropdown(relation, ["Product constant", "Product variable"])
        return true
      case 'Order_no':
        buildQueryAndChangeDropdown(relation, ["Order constant", "Order variable"])
        return true
      case 'Price':
        buildQueryAndChangeDropdown(relation, ["Product constant", "Product variable"])
        return true
      case 'Credit_limit':
        buildQueryAndChangeDropdown(relation, ["Ordered", "Customer constant", "Customer variable"])
        return true
      case 'Customer_id':
        buildQueryAndChangeDropdown(relation, ["Ordered", "Customer constant", "Customer variable"])
        return true
      default:
        return false
    }
  }