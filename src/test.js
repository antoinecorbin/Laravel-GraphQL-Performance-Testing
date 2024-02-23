import http from 'k6/http';
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

const GRAPHQL_ENDPOINT = 'https://localhost';
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