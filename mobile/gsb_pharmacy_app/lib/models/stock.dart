class Stock {
  final int id;
  final String medicamentName;
  final int quantity;
  final double purchasePrice;
  final double sellingPrice;

  Stock({
    required this.id,
    required this.medicamentName,
    required this.quantity,
    required this.purchasePrice,
    required this.sellingPrice,
  });

  factory Stock.fromJson(Map<String, dynamic> json) {
    return Stock(
      id: json['id'],
      medicamentName: json['medicament_name'],
      quantity: json['quantity'],
      purchasePrice: json['purchase_price'].toDouble(),
      sellingPrice: json['selling_price'].toDouble(),
    );
  }
} 