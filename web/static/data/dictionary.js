export default {
    presentation: {
        status: {
            proposal:   'Proposta',
            accepted:   'Contratada',
            completed:  'Realizada',
            paid:       'Paga',
            failed:     'Pagamento pendente',
            rejected:   'Não confirmada',
            cancelled:  'Cancelada',
            disputed:   'Em disputa'
        }
    },
    billing: {
        instalments: {
            status: {
                pending:    'Aguardando confirmação',
                paid:       'Pago',
            }
        },
        payment: {
            status: {
                pending:    'Aguardando confirmação',
                completed:  'Realizado',
                failed:     'Falha',
                overdue:    'Vencido',
            },
            method: {
                pix:    'Pix',
                boleto: 'Boleto',
                cc:     'Cartão de Crédito'
            }
        }
    }
}