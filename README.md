# Test de charge - Laravel / GraphQL

## Aperçu
Ce repository contient des ressources et des exemples pour mener à bien des tests de performance sur des applications Laravel utilisant GraphQL. 
Nous utilisons k6, un outil de test de charge, pour simuler des scénarios d'utilisation réels et évaluer la capacité de l'application à gérer différentes charges de travail.


## Installation de k6
Pour commencer avec k6, vous devez d'abord l'installer sur votre système. k6 peut être installé sur Windows, macOS, et Linux. Voici comment vous pouvez l'installer sur différents systèmes d'exploitation :

### Sur MacOS
    brew install k6

### Sur Windows
    choco install k6

### Sur Linux
    sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
    echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
    sudo apt-get update
    sudo apt-get install k6

Pour plus de détails et d'options d'installation, veuillez consulter la documentation officielle de k6.

## Utilisation de k6
Pour exécuter un test de charge avec k6, vous devez d'abord écrire un script de test. Un script de test k6 est écrit en JavaScript et suit une structure spécifique. Voici un exemple de script de test k6 :

```import http from 'k6/http';
import { check, sleep } from 'k6';

export class GraphQLLoadTest {
    constructor(url) {
        this.url = url;
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }

    sendQuery(query) {
        const payload = JSON.stringify({ query });
        return http.post(this.url, payload, { headers: this.headers });
    }

    testQuery(name, query) {
        const response = this.sendQuery(query);
        check(response, {
            [`${name} status was 200`]: (r) => r.status === 200,
        });
    }
}

export const options = {
    vus: 10, // Nombre d'utilisateurs virtuels
    duration: '30s', // Durée du test
};

const GRAPHQL_ENDPOINT = 'https://localhost;
const loadTest = new GraphQLLoadTest(GRAPHQL_ENDPOINT);

export default function () {
    // Exemple de requête pour récupérer des thèmes
    const themesQuery = `
    {
        themes(onlyHighlight: false) {
            title
            icon
            highlight
        }
    }
    `;
    loadTest.testQuery('themes', themesQuery);

    // Exemple de mutation pour ajouter un nouveau thème
    const addThemeMutation = `
    mutation {
        addTheme(title: "New Theme", icon: "icon_url", highlight: true) {
            title
            icon
            highlight
        }
    }
    `;
    loadTest.testQuery('addTheme', addThemeMutation);

    sleep(1);
}
```
### Lancer le test
Pour lancer le test, vous devez exécuter la commande suivante dans votre terminal :

    k6 run test.js

### Intrépétation des résultats
Après avoir exécuté le test, k6 générera un rapport de test qui vous donnera des informations sur la performance de votre application. Voici un exemple de rapport de test k6 :

```

          /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io

     execution: local
        script: test.js
        output: -

     scenarios: (100.00%) 1 scenario, 10 max VUs, 1m0s max duration (incl. graceful stop):
              * default: 10 looping VUs for 30s (gracefulStop: 30s)


     ✓ themes status was 200

     checks.........................: 100.00% ✓ 240      ✗ 0   
     data_received..................: 2.5 MB  80 kB/s
     data_sent......................: 71 kB   2.3 kB/s
     http_req_blocked...............: avg=1.15ms   min=0s       med=1µs      max=32.54ms  p(90)=3µs      p(95)=6.29µs  
     http_req_connecting............: avg=126.1µs  min=0s       med=0s       max=4.1ms    p(90)=0s       p(95)=0s      
     http_req_duration..............: avg=289.99ms min=224.53ms med=249.79ms max=722.38ms p(90)=315.87ms p(95)=660.18ms
       { expected_response:true }...: avg=289.99ms min=224.53ms med=249.79ms max=722.38ms p(90)=315.87ms p(95)=660.18ms
     http_req_failed................: 0.00%   ✓ 0        ✗ 240 
     http_req_receiving.............: avg=698.05µs min=46µs     med=333µs    max=5.77ms   p(90)=1.57ms   p(95)=2.2ms   
     http_req_sending...............: avg=297.24µs min=30µs     med=110µs    max=4.44ms   p(90)=439.79µs p(95)=713.29µs
     http_req_tls_handshaking.......: avg=853.54µs min=0s       med=0s       max=25.67ms  p(90)=0s       p(95)=0s      
     http_req_waiting...............: avg=288.99ms min=223.03ms med=249.31ms max=721.85ms p(90)=315.17ms p(95)=654.13ms
     http_reqs......................: 240     7.734908/s
     iteration_duration.............: avg=1.29s    min=1.22s    med=1.25s    max=1.72s    p(90)=1.31s    p(95)=1.69s   
     iterations.....................: 240     7.734908/s
     vus............................: 10      min=10     max=10
     vus_max........................: 10      min=10     max=10


running (0m31.0s), 00/10 VUs, 240 complete and 0 interrupted iterations
default ✓ [======================================] 10 VUs  30s
```
Après avoir exécuté votre test avec k6, vous obtiendrez un rapport dans votre terminal. Voici certaines valeurs importantes à examiner :

- **http_req_duration** : Temps moyen de réponse. Des valeurs élevées peuvent indiquer des problèmes de performance. 
- **http_reqs** : Nombre total de requêtes effectuées. Utile pour comprendre le débit. 
- **http_req_failed** : Pourcentage de requêtes échouées. Un taux élevé peut indiquer des problèmes de stabilité ou de capacité. 
- **vus et vus_max** : Nombre d'utilisateurs simultanés. Utile pour évaluer la scalabilité de votre application.

Ces métriques vous aident à comprendre comment votre application se comporte sous charge et où vous pourriez avoir besoin d'optimiser.
Cependant, ces métriques fournissent un point de départ pour analyser la performance de votre application, mais elles ne représentent pas l'ensemble du tableau. 