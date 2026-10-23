export interface DefeatMessage {
  title: string
  description: string
}

const messages: Record<'wrong' | 'timeout', DefeatMessage[]> = {
  wrong: [
    { title: 'Quase um clutch.', description: 'Uma tecla separou você da próxima rodada.' },
    { title: 'Essa não era a call.', description: 'O ícone enganou desta vez. Na próxima, você leva.' },
    { title: 'A tecla escapou.', description: 'Recarrega o foco e vem buscar uma sequência maior.' },
    { title: 'Foi por uma tecla.', description: 'Respira, reposiciona e tenta de novo.' },
    { title: 'Round do adversário.', description: 'Desta vez, a tecla não encaixou. Bora buscar a revanche?' },
    { title: 'Hora da revanche.', description: 'A próxima sequência pode ser a sua melhor.' },
  ],
  timeout: [
    { title: 'O tempo acabou.', description: 'Dez segundos passam rápido. Vamos de novo?' },
    { title: 'O relógio levou essa.', description: 'Dez segundos voaram. Bora mais uma?' },
    { title: 'Faltou velocidade.', description: 'Na próxima, confia no instinto e manda a tecla.' },
    { title: 'O round passou.', description: 'O cronômetro zerou. Uma nova chance está logo ali.' },
    { title: 'Tempo é tudo.', description: 'Desta vez, os dez segundos venceram. Pede a revanche?' },
    { title: 'Sem tempo, agente.', description: 'Recarrega o reflexo e volta para o desafio.' },
  ],
}

export function pickDefeatMessage(outcome: 'wrong' | 'timeout', previousTitle?: string): DefeatMessage {
  const choices = messages[outcome].filter(message => message.title !== previousTitle)
  return choices[Math.floor(Math.random() * choices.length)]
}
