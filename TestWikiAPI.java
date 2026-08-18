import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

public class TestWikiAPI {
    public static void main(String[] args) throws Exception {
        String[] words = {"jengibre", "casa", "perro"};
        
        HttpClient client = HttpClient.newBuilder()
                .followRedirects(HttpClient.Redirect.ALWAYS)
                .build();

        for (String word : words) {
            String url = "https://es.wikipedia.org/w/api.php?action=query"
                    + "&generator=search&gsrsearch=" + URLEncoder.encode(word, StandardCharsets.UTF_8)
                    + "&gsrlimit=1&prop=pageimages&pithumbsize=600&format=json";
            
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("User-Agent", "LoopDeck/1.0 (flashcard app)")
                    .GET()
                    .build();

            HttpResponse<String> res = client.send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println("=== " + word + " ===");
            System.out.println("Status: " + res.statusCode());
            
            String body = res.body();
            // Just doing a simple regex to see if we get the source
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("\"source\":\"([^\"]+)\"").matcher(body);
            if (m.find()) {
                System.out.println("Image: " + m.group(1));
            } else {
                System.out.println("No image found in JSON. Body: " + body.substring(0, Math.min(body.length(), 200)));
            }
            System.out.println();
        }
    }
}
