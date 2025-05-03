import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:gsb_pharmacy_app/models/invoice.dart';
import 'package:gsb_pharmacy_app/models/stock.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:network_info_plus/network_info_plus.dart';

/// Service de gestion des appels API
/// Gère l'authentification, les requêtes HTTP et la persistance des données
class ApiService {
  // Configuration de base
  static const String baseUrl = 'http://10.74.2.202:5001/api'; // URL de l'API
  static const String tokenKey = 'auth_token'; // Clé pour stocker le token
  static const Duration timeout = Duration(seconds: 30); // Timeout des requêtes

  // Variables d'état de l'utilisateur
  static String? _token; // Token JWT
  static String? userEmail; // Email de l'utilisateur
  static String? userName; // Nom de l'utilisateur
  static String? userPhone; // Téléphone de l'utilisateur

  /// Récupère le token d'authentification depuis le stockage local
  static Future<String?> get token async {
    if (_token == null) {
      final prefs = await SharedPreferences.getInstance();
      _token = prefs.getString(tokenKey);
    }
    return _token;
  }

  /// Authentifie l'utilisateur avec email et mot de passe
  /// Retourne true si la connexion est réussie
  static Future<bool> login(String email, String password) async {
    try {
      print('=== Début de la tentative de connexion ===');
      print('Email: $email');
      print('URL de base: $baseUrl');
      print('URL complète: $baseUrl/auth/login');

      // Vérification de la connectivité réseau
      final connectivityResult = await Connectivity().checkConnectivity();
      print('État de la connectivité: $connectivityResult');

      if (connectivityResult == ConnectivityResult.none) {
        print('Pas de connexion internet');
        return false;
      }

      // Récupération de l'adresse IP WiFi
      try {
        final info = NetworkInfo();
        final wifiIP = await info.getWifiIP();
        print('Adresse IP WiFi: $wifiIP');
      } catch (e) {
        print('Erreur lors de la récupération de l\'adresse IP: $e');
      }

      // Test de connexion au serveur
      try {
        print('Test de connexion au serveur...');
        final testResponse = await http.get(
          Uri.parse('$baseUrl/test'),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        ).timeout(timeout);

        print('Test connection successful: ${testResponse.statusCode}');
        print('Response body: ${testResponse.body}');
      } catch (e) {
        print('Test connection failed: $e');
        if (e is SocketException) {
          print('Détails de l\'erreur Socket:');
          print('- Address: ${e.address}');
          print('- Port: ${e.port}');
          print('- Message: ${e.message}');
          print('- OS Error: ${e.osError}');
        }
        return false;
      }

      // Tentative de connexion
      print('Tentative de login...');
      final response = await http
          .post(
            Uri.parse('$baseUrl/auth/login'),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: json.encode({'email': email, 'password': password}),
          )
          .timeout(timeout);

      print('Status code: ${response.statusCode}');
      print('Response body: ${response.body}');
      print('Headers: ${response.headers}');

      if (response.statusCode == 200) {
        // Connexion réussie
        final data = json.decode(response.body);
        _token = data['token'];
        userEmail = email;
        userName = data['user']['name'];
        userPhone = data['user']['phone'];
        await _saveToken();
        print('Connexion réussie!');
        print('Token: $_token');
        return true;
      } else {
        print('Échec de la connexion: ${response.statusCode}');
        print('Message d\'erreur: ${response.body}');
        return false;
      }
    } catch (e) {
      print('Erreur lors de la connexion: $e');
      if (e is SocketException) {
        print('Détails de l\'erreur Socket:');
        print('- Address: ${e.address}');
        print('- Port: ${e.port}');
        print('- Message: ${e.message}');
        print('- OS Error: ${e.osError}');
      }
      return false;
    }
  }

  /// Déconnecte l'utilisateur et efface les données de session
  static Future<void> logout() async {
    _token = null;
    userEmail = null;
    userName = null;
    userPhone = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(tokenKey);
  }

  /// Génère les headers HTTP avec le token d'authentification
  static Future<Map<String, String>> getHeaders() async {
    final token = await ApiService.token;
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  /// Récupère la liste des commandes
  static Future<List<Map<String, dynamic>>> getOrders() async {
    try {
      final token = await _getToken();
      final response = await http.get(
        Uri.parse('$baseUrl/orders'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return List<Map<String, dynamic>>.from(data);
      }
      throw Exception('Erreur lors de la récupération des commandes');
    } catch (e) {
      print('Erreur: $e');
      throw Exception('Erreur lors de la récupération des commandes');
    }
  }

  /// Récupère la liste des factures
  static Future<List<Invoice>> getInvoices() async {
    try {
      final authToken = await token;
      if (authToken == null) {
        throw Exception('Token non trouvé');
      }
      final response = await http.get(
        Uri.parse('$baseUrl/invoices'),
        headers: {
          'Authorization': 'Bearer $authToken',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Invoice.fromJson(json)).toList();
      }
      throw Exception(
          'Erreur lors de la récupération des factures: ${response.statusCode}');
    } catch (e) {
      print('Erreur: $e');
      throw Exception('Erreur lors de la récupération des factures: $e');
    }
  }

  /// Récupère la liste des stocks
  static Future<List<Stock>> getStocks() async {
    try {
      final token = await _getToken();
      final response = await http.get(
        Uri.parse('$baseUrl/stocks'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Stock.fromJson(json)).toList();
      }
      throw Exception('Erreur lors de la récupération des stocks');
    } catch (e) {
      print('Erreur: $e');
      throw Exception('Erreur lors de la récupération des stocks');
    }
  }

  /// Récupère le token depuis le stockage local
  static Future<String> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(tokenKey);
    if (token == null) {
      throw Exception('Token non trouvé');
    }
    return token;
  }

  /// Récupère les détails d'une commande spécifique
  static Future<Map<String, dynamic>> getOrderDetails(String orderId) async {
    try {
      final headers = await getHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl/orders/$orderId'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      }
      throw Exception(
          'Échec du chargement des détails de la commande: ${response.statusCode}');
    } catch (e) {
      print('Erreur lors de la récupération des détails de la commande: $e');
      rethrow;
    }
  }

  /// Récupère la facture d'une commande spécifique
  static Future<Map<String, dynamic>> getInvoice(String orderId) async {
    try {
      final headers = await getHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl/orders/$orderId/invoice'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      }
      throw Exception(
          'Échec du chargement de la facture: ${response.statusCode}');
    } catch (e) {
      print('Erreur lors de la récupération de la facture: $e');
      rethrow;
    }
  }

  /// Sauvegarde le token dans le stockage local
  static Future<void> _saveToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(tokenKey, _token!);
  }
}
