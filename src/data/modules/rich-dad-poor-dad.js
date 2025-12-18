export const richDadPoorDadModule = {
  id: 'rich-dad-poor-dad',
  title: 'Père Riche, Père Pauvre',
  category: 'education-financiere',
  description: 'Découvrez les principes fondamentaux de la liberté financière et comment penser comme les riches',
  icon: 'FaMoneyBillWave',
  color: 'green',
  duration: '2h',
  level: 'Débutant',
  content: [
    {
      id: 'introduction',
      title: 'Introduction',
      type: 'text',
      content: 'Le livre "Père Riche, Père Pauvre" de Robert Kiyosaki est un classique de l\'éducation financière. Il raconte l\'histoire de deux pères : l\'un instruit mais financièrement instable, l\'autre sans éducation formelle mais financièrement indépendant.'
    },
    {
      id: 'lesson1',
      title: 'Les riches ne travaillent pas pour l\'argent',
      type: 'text',
      content: 'La classe moyenne et les pauvres échangent leur temps contre de l\'argent. Les riches font en sorte que l\'argent travaille pour eux à travers des actifs qui génèrent des revenus passifs.'
    },
    {
      id: 'lesson2',
      title: 'Pourquoi enseigner l\'éducation financière ?',
      type: 'text',
      content: 'L\'école n\'enseigne pas la gestion de l\'argent. Pour devenir financièrement indépendant, vous devez comprendre les concepts d\'actifs, de passifs et de flux de trésorerie.'
    },
    {
      id: 'lesson3',
      title: 'Occupez-vous de vos propres affaires',
      type: 'text',
      content: 'Ne comptez pas uniquement sur un salaire. Développez des actifs qui génèrent des revenus, comme des investissements immobiliers, des actions ou une entreprise.'
    },
    {
      id: 'quiz',
      title: 'Quiz de fin de module',
      type: 'quiz',
      questions: [
        {
          id: 1,
          question: "Quelle est la différence fondamentale entre un actif et un passif selon Robert Kiyosaki ?",
          options: [
            "Un actif met de l'argent dans votre poche, un passif en retire",
            "Un actif est un bien immobilier, un passif est une voiture",
            "Un actif coûte cher, un passif est bon marché",
            "Il n'y a pas de différence"
          ],
          correctAnswer: 0,
          explanation: "Selon Kiyosaki, un actif est quelque chose qui met de l'argent dans votre poche, tandis qu'un passif en retire. C'est la base de la liberté financière."
        },
        {
          id: 2,
          question: "Pourquoi les riches ne travaillent-ils pas pour l'argent selon le livre ?",
          options: [
            "Parce qu'ils sont paresseux",
            "Parce qu'ils font travailler l'argent pour eux",
            "Parce qu'ils héritent de leur fortune",
            "Parce qu'ils gagnent au loto"
          ],
          correctAnswer: 1,
          explanation: "Les riches comprennent comment faire travailler l'argent pour eux à travers des investissements et des actifs générateurs de revenus."
        },
        {
          id: 3,
          question: "Quelle est la meilleure façon de s'enrichir selon les principes du livre ?",
          options: [
            "Travailler dur dans un emploi bien payé",
            "Acheter des actifs qui génèrent des revenus",
            "Économiser tout son argent à la banque",
            "Gagner à la loterie"
          ],
          correctAnswer: 1,
          explanation: "Le livre met l'accent sur l'acquisition d'actifs qui génèrent des revenus passifs comme clé de la richesse."
        },
        {
          id: 4,
          question: "Que signifie 'occupez-vous de vos propres affaires' dans le contexte du livre ?",
          options: [
            "Ne pas se mêler des affaires des autres",
            "Développer ses propres sources de revenus en plus de son emploi",
            "Travailler en freelance",
            "Créer une entreprise du jour au lendemain"
          ],
          correctAnswer: 1,
          explanation: "Cela signifie qu'il faut développer ses propres actifs et sources de revenus en parallèle de son emploi principal."
        },
        {
          id: 5,
          question: "Quelle est l'attitude des riches face à l'échec selon le livre ?",
          options: [
            "Ils l'évitent à tout prix",
            "Ils le voient comme une opportunité d'apprentissage",
            "Ils en ont peur",
            "Ils blâment les autres pour leurs échecs"
          ],
          correctAnswer: 1,
          explanation: "Les riches voient l'échec comme une partie nécessaire du processus d'apprentissage et une opportunité de s'améliorer."
        }
      ]
    }
  ],
  resources: [
    {
      title: 'Interview de Robert Kiyosaki',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=dummy-rich-dad-interview'
    },
    {
      title: 'Résumé du livre en 10 minutes',
      type: 'article',
      url: 'https://example.com/resume-pere-riche-pauvre'
    }
  ]
}
