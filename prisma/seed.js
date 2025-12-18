import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create achievements
  const achievements = await Promise.all([
    prisma.achievement.upsert({
      where: { name: 'Premier Pas' },
      update: {},
      create: {
        name: 'Premier Pas',
        description: 'Compléter votre premier module',
        icon: '🎯',
        color: '#4CAF50',
        xpReward: 50,
        condition: { type: 'modules_completed', count: 1 }
      }
    }),
    prisma.achievement.upsert({
      where: { name: 'Course Crusher' },
      update: {},
      create: {
        name: 'Course Crusher',
        description: 'Compléter 3 modules',
        icon: '🏆',
        color: '#FFD700',
        xpReward: 150,
        condition: { type: 'modules_completed', count: 3 }
      }
    }),
    prisma.achievement.upsert({
      where: { name: 'Quiz Master' },
      update: {},
      create: {
        name: 'Quiz Master',
        description: 'Répondre correctement à 10 quiz',
        icon: '🧠',
        color: '#9C27B0',
        xpReward: 100,
        condition: { type: 'quizzes_correct', count: 10 }
      }
    }),
    prisma.achievement.upsert({
      where: { name: 'XP Hunter' },
      update: {},
      create: {
        name: 'XP Hunter',
        description: 'Atteindre 500 XP',
        icon: '⭐',
        color: '#2196F3',
        xpReward: 75,
        condition: { type: 'xp_total', count: 500 }
      }
    }),
    prisma.achievement.upsert({
      where: { name: 'Contributeur' },
      update: {},
      create: {
        name: 'Contributeur',
        description: 'Créer 5 posts dans la communauté',
        icon: '✍️',
        color: '#FF5722',
        xpReward: 100,
        condition: { type: 'posts_created', count: 5 }
      }
    }),
    prisma.achievement.upsert({
      where: { name: 'Streak Legend' },
      update: {},
      create: {
        name: 'Streak Legend',
        description: 'Maintenir une série de 7 jours',
        icon: '🔥',
        color: '#F44336',
        xpReward: 200,
        condition: { type: 'daily_streak', count: 7 }
      }
    })
  ])

  console.log(`✅ Created ${achievements.length} achievements`)

  // Create modules based on documentation
  const modules = await Promise.all([
    prisma.module.upsert({
      where: { id: 'module-info-verification' },
      update: {},
      create: {
        id: 'module-info-verification',
        title: 'Vérification des informations',
        description: 'Apprenez à distinguer les faits des opinions et à vérifier les sources d\'information.',
        level: 'BEGINNER',
        audiences: ['STUDENTS', 'GENERAL'],
        estimatedMinutes: 30,
        orderIndex: 1,
        imageUrl: '/images/modules/verification.jpg',
        lessons: {
          create: [
            {
              title: 'Introduction à la vérification',
              summary: 'Pourquoi la vérification des informations est cruciale',
              content: `# Introduction à la vérification des informations

Dans un monde où l'information circule instantanément, savoir vérifier ce que l'on lit est devenu une compétence essentielle.

## Pourquoi vérifier ?

- Les fausses informations se propagent 6 fois plus vite que les vraies
- 86% des gens ont déjà partagé une fausse nouvelle sans le savoir
- Une information non vérifiée peut avoir des conséquences graves

## Les bases de la vérification

1. **Identifier la source** : Qui publie cette information ?
2. **Croiser les sources** : D'autres médias fiables en parlent-ils ?
3. **Vérifier la date** : L'information est-elle récente et pertinente ?
4. **Analyser les preuves** : Y a-t-il des éléments vérifiables ?`,
              orderIndex: 1
            },
            {
              title: 'Faits vs Opinions',
              summary: 'Différencier les faits objectifs des opinions subjectives',
              content: `# Faits vs Opinions

## Qu'est-ce qu'un fait ?

Un fait est une information vérifiable et objective. Il peut être prouvé ou réfuté par des preuves.

**Exemples de faits :**
- "Madagascar est une île située dans l'océan Indien"
- "La Terre tourne autour du Soleil en 365 jours"

## Qu'est-ce qu'une opinion ?

Une opinion est un point de vue personnel qui ne peut pas être vérifié objectivement.

**Exemples d'opinions :**
- "C'est le meilleur film de l'année"
- "Cette politique est la plus efficace"

## Comment les distinguer ?

| Caractéristique | Fait | Opinion |
|----------------|------|---------|
| Vérifiable | Oui | Non |
| Objectif | Oui | Non |
| Universel | Oui | Varie selon les personnes |`,
              orderIndex: 2
            },
            {
              title: 'Les sources fiables',
              summary: 'Identifier et évaluer la fiabilité des sources',
              content: `# Évaluer la fiabilité des sources

## Critères d'une source fiable

### 1. Autorité
- Qui est l'auteur ?
- Quelles sont ses qualifications ?
- L'organisation est-elle reconnue ?

### 2. Précision
- Les informations sont-elles exactes ?
- Y a-t-il des références ?
- Les données sont-elles vérifiables ?

### 3. Objectivité
- Le ton est-il neutre ?
- Présente-t-on plusieurs points de vue ?
- Y a-t-il un conflit d'intérêts potentiel ?

### 4. Actualité
- La date de publication est-elle récente ?
- Les informations sont-elles toujours valables ?

## Sources généralement fiables
- Agences de presse (AFP, Reuters)
- Médias établis avec charte éditoriale
- Publications académiques
- Sites officiels gouvernementaux`,
              orderIndex: 3
            }
          ]
        },
        quizzes: {
          create: [
            {
              question: 'Lequel de ces énoncés est un FAIT ?',
              choices: [
                'Le football est le meilleur sport du monde',
                'Madagascar compte environ 28 millions d\'habitants',
                'Les films d\'action sont plus intéressants que les comédies',
                'Ce restaurant sert la meilleure cuisine de la ville'
              ],
              correctIndex: 1,
              rationale: 'Un fait est vérifiable. La population de Madagascar est une donnée statistique vérifiable, contrairement aux autres options qui sont des opinions subjectives.',
              difficulty: 'EASY',
              tags: ['faits', 'opinions', 'vérification'],
              audiences: ['STUDENTS', 'GENERAL'],
              orderIndex: 1
            },
            {
              question: 'Quel critère N\'est PAS essentiel pour évaluer la fiabilité d\'une source ?',
              choices: [
                'L\'autorité de l\'auteur',
                'Le nombre de partages sur les réseaux sociaux',
                'La précision des informations',
                'L\'objectivité du contenu'
              ],
              correctIndex: 1,
              rationale: 'Le nombre de partages n\'est pas un indicateur de fiabilité. Une fausse information peut devenir virale. Les critères importants sont l\'autorité, la précision et l\'objectivité.',
              difficulty: 'INTERMEDIATE',
              tags: ['sources', 'fiabilité', 'évaluation'],
              audiences: ['STUDENTS', 'GENERAL'],
              orderIndex: 2
            }
          ]
        }
      }
    }),
    prisma.module.upsert({
      where: { id: 'module-fake-news' },
      update: {},
      create: {
        id: 'module-fake-news',
        title: 'Reconnaître les fake news',
        description: 'Développez vos compétences pour identifier et combattre la désinformation.',
        level: 'INTERMEDIATE',
        audiences: ['STUDENTS', 'GENERAL', 'DEVELOPERS'],
        estimatedMinutes: 45,
        orderIndex: 2,
        imageUrl: '/images/modules/fakenews.jpg',
        lessons: {
          create: [
            {
              title: 'Anatomie d\'une fake news',
              summary: 'Comprendre comment les fausses informations sont construites',
              content: `# Anatomie d'une fake news

## Définition

Une fake news est une fausse information délibérément créée pour tromper, manipuler ou induire en erreur.

## Les éléments typiques

### 1. Le titre accrocheur
- Utilisation de majuscules excessives
- Mots émotionnels (CHOQUANT, INCROYABLE)
- Promesses sensationnelles

### 2. L'apparence de légitimité
- Mise en page imitant des médias connus
- Faux logos ou noms similaires
- Citations inventées

### 3. Le contenu manipulateur
- Faits partiellement vrais, déformés
- Contexte absent ou modifié
- Images sorties de leur contexte

### 4. L'appel à l'émotion
- Peur, colère, indignation
- Sentiment d'urgence
- "Partagez avant que ce soit supprimé !"`,
              orderIndex: 1
            }
          ]
        },
        quizzes: {
          create: [
            {
              question: 'Quel élément suggère qu\'un article pourrait être une fake news ?',
              choices: [
                'Il cite des sources académiques vérifiables',
                'Il utilise un titre en MAJUSCULES avec des mots comme "CHOQUANT"',
                'Il présente plusieurs points de vue',
                'Il a été publié dans un média reconnu'
              ],
              correctIndex: 1,
              rationale: 'Les titres sensationnalistes en majuscules avec des mots émotionnels sont un indicateur classique de fake news. Les sources fiables utilisent des titres informatifs et mesurés.',
              difficulty: 'EASY',
              tags: ['fake news', 'identification', 'manipulation'],
              audiences: ['STUDENTS', 'GENERAL'],
              orderIndex: 1
            }
          ]
        }
      }
    }),
    prisma.module.upsert({
      where: { id: 'module-education-financiere' },
      update: {},
      create: {
        id: 'module-education-financiere',
        title: 'Éducation Financière',
        description: 'Basé sur "Père Riche, Père Pauvre" - Apprenez les bases de l\'intelligence financière.',
        level: 'BEGINNER',
        audiences: ['STUDENTS', 'GENERAL'],
        estimatedMinutes: 60,
        orderIndex: 3,
        imageUrl: '/images/modules/finance.jpg',
        lessons: {
          create: [
            {
              title: 'Les riches ne travaillent pas pour l\'argent',
              summary: 'Comprendre la différence fondamentale dans la relation à l\'argent',
              content: `# Leçon 1 : Les riches ne travaillent pas pour l'argent

## Le concept clé

La principale différence entre les riches et les pauvres réside dans leur relation avec l'argent :
- **Les pauvres travaillent pour l'argent** : Ils échangent leur temps contre un salaire
- **Les riches font travailler l'argent pour eux** : Ils créent des systèmes qui génèrent des revenus

## La peur et le désir

Deux émotions contrôlent la plupart des gens :
1. **La peur** de manquer d'argent les pousse à travailler
2. **Le désir** d'acheter des choses les maintient dans le cycle

## Le piège du salaire

Augmenter son salaire sans changer sa mentalité mène souvent à :
- Plus de dépenses
- Plus de dettes
- Le même niveau de stress financier

## Application pratique

- Observez comment vous réagissez face à l'argent
- Identifiez vos peurs et désirs financiers
- Commencez à chercher des opportunités de faire travailler votre argent`,
              orderIndex: 1
            },
            {
              title: 'Pourquoi enseigner l\'éducation financière',
              summary: 'L\'importance de comprendre les finances personnelles',
              content: `# Leçon 2 : L'importance de l'éducation financière

## Le problème actuel

L'école enseigne :
- ✅ Les mathématiques
- ✅ L'histoire
- ✅ Les sciences
- ❌ Comment gérer son argent

## Actifs vs Passifs

### Qu'est-ce qu'un ACTIF ?
Un actif met de l'argent dans votre poche :
- Investissements qui génèrent des dividendes
- Immobilier locatif
- Entreprise qui fonctionne sans vous
- Propriété intellectuelle

### Qu'est-ce qu'un PASSIF ?
Un passif retire de l'argent de votre poche :
- Voiture (essence, assurance, entretien)
- Maison principale (taxes, réparations)
- Dettes de consommation

## La règle d'or

> "Les riches achètent des actifs. Les pauvres et la classe moyenne achètent des passifs qu'ils pensent être des actifs."

## Exercice pratique

Faites la liste de vos actifs et passifs. Quels changements pourriez-vous faire ?`,
              orderIndex: 2
            }
          ]
        },
        quizzes: {
          create: [
            {
              question: 'Selon le concept de "Père Riche, Père Pauvre", qu\'est-ce qu\'un ACTIF ?',
              choices: [
                'Une voiture de luxe',
                'Une grande maison',
                'Un investissement qui génère des revenus passifs',
                'Des vêtements de marque'
              ],
              correctIndex: 2,
              rationale: 'Un actif est quelque chose qui met de l\'argent dans votre poche. Une voiture et une maison (résidence principale) sont des passifs car ils génèrent des coûts.',
              difficulty: 'EASY',
              tags: ['finance', 'actifs', 'passifs'],
              audiences: ['STUDENTS', 'GENERAL'],
              orderIndex: 1
            },
            {
              question: 'Pourquoi les riches "ne travaillent pas pour l\'argent" selon cette philosophie ?',
              choices: [
                'Ils sont paresseux',
                'Ils font travailler l\'argent pour eux à travers des investissements',
                'Ils ont hérité de fortunes',
                'Ils ont de la chance'
              ],
              correctIndex: 1,
              rationale: 'Les riches créent ou acquièrent des actifs (entreprises, investissements) qui génèrent des revenus sans leur travail direct. C\'est l\'argent qui travaille pour eux.',
              difficulty: 'INTERMEDIATE',
              tags: ['finance', 'revenus passifs', 'mentalité'],
              audiences: ['STUDENTS', 'GENERAL'],
              orderIndex: 2
            }
          ]
        }
      }
    })
  ])

  console.log(`✅ Created ${modules.length} modules with lessons and quizzes`)

  // Create certifications
  const certifications = await Promise.all([
    prisma.certification.upsert({
      where: { id: 'cert-media-literacy' },
      update: {},
      create: {
        id: 'cert-media-literacy',
        title: 'Littératie Médiatique Certifié',
        description: 'Certification attestant vos compétences en analyse et vérification des médias.',
        requirements: {
          modules: ['module-info-verification', 'module-fake-news'],
          minQuizScore: 80
        },
        icon: '📜',
        isActive: true
      }
    }),
    prisma.certification.upsert({
      where: { id: 'cert-financial-literacy' },
      update: {},
      create: {
        id: 'cert-financial-literacy',
        title: 'Éducation Financière Certifié',
        description: 'Certification attestant vos connaissances en intelligence financière.',
        requirements: {
          modules: ['module-education-financiere'],
          minQuizScore: 75
        },
        icon: '💰',
        isActive: true
      }
    })
  ])

  console.log(`✅ Created ${certifications.length} certifications`)

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aleloianatra.mg' },
    update: {},
    create: {
      email: 'admin@aleloianatra.mg',
      name: 'Administrateur',
      passwordHash: adminPassword,
      role: 'ADMIN',
      audience: 'GENERAL',
      xpTotal: 1000,
      profileCompletion: 100
    }
  })

  console.log(`✅ Created admin user: ${admin.email}`)

  console.log('\n🎉 Database seeded successfully!')
  console.log('\n📝 Admin credentials:')
  console.log('   Email: admin@aleloianatra.mg')
  console.log('   Password: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

