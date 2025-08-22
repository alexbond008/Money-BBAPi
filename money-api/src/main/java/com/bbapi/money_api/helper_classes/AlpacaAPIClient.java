package com.bbapi.money_api.helper_classes;

import com.google.gson.Gson;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AlpacaAPIClient {

    private Logger logger = LoggerFactory.getLogger(AlpacaAPIClient.class);

    private static String API_URL = "https://data.alpaca.markets/v2/stocks";
    private static String API_KEY = ""; // Replace with your API Key
    private static String API_SECRET = ""; // Replace with your API Secret

    private static OkHttpClient client = new OkHttpClient();

    public static void main(String[] args) {
        try {
            API_KEY = new String(Files.readAllBytes(Paths.get("money-api\\src\\main\\java\\com\\bbapi\\money_api\\helper_classes\\key.txt"))).trim(); // Provide the correct path to your file
            API_SECRET = new String(Files.readAllBytes(Paths.get("money-api\\src\\main\\java\\com\\bbapi\\money_api\\helper_classes\\secret.txt"))).trim(); // Provide the correct path to your file
        } catch (IOException e) {
            e.printStackTrace();
        }

        String symbol = "AAPL";  // Example: Apple stock symbol
        String timeframe = "1D";  // Options: minute, hour, day
        String startDate = "2023-01-01";
        String endDate = "2023-08-22";

        try {
            String data = getHistoricalData(symbol, timeframe, startDate, endDate);
            System.out.println(data);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static String getHistoricalData(String symbol, String timeframe, String startDate, String endDate) throws IOException {
        String url = API_URL + "/bars?symbols="+symbol+"&timeframe=" + timeframe + "&start=" + startDate + "&end=" + endDate;

        // Create the request with the necessary headers
        Request request = new Request.Builder()
                .url(url)
                .get()
                .addHeader("accept", "application/json")
                .header("APCA-API-KEY-ID", API_KEY)
                .header("APCA-API-SECRET-KEY", API_SECRET)
                .build();
        System.out.println(request);
        // Send the request and get the response
        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful()) {
                return response.body().string(); // Return the response as a JSON string
            } else {
                throw new IOException("Unexpected code " + response);
            }
        }
    }
}