const db = require('../db')
const {isNumber} = require('../helpers')
const uuid = require('uuid');

const verifyDuplicateEntry = async (field, value) => {
    let sql = "SELECT 1 FROM pessoas WHERE "+field+" = '"+value+"' "
    const rows = await db.query(sql)
    if (rows.length > 0 ) {
        return true
    } else {
        return false
    }  
}

//@desc Create new Person
//@route POST /pessoas
//@access public
const createPerson = async (req, res) => {
    const { nome, apelido, nascimento, stack} = req.body;
    const userUuid  = uuid.v4()
    
    // fazendo validações
    //verificando se os campos obrigatórios foram informados
    if (!nome || !apelido || !nascimento) {
        return res.status(422).json({error: "Os campos nome, apelido e nascimento são obrigatórios"})
    }

    //verificando se os campos passados estão corretos
    if (isNumber(nome)) {
        return res.status(400).json({error: "O nome deve ser string e não número"})
    }

    if (isNumber(apelido)) {
        return res.status(400).json({error: "O apelido deve ser string e não número"})
    }    

    // a data nascimento não pode ser maior que a data de hoje
    var dateBirth = new Date(nascimento);
    var today = new Date();
    if (dateBirth > today) {
        return res.status(400).json({error: "A data de nascimento não pode estar no futuro"})
    }

    // validando as stacks, para que todos os campos informados sejam do tipo string
    // Verifique se cada elemento é do tipo string
    if (typeof stack !== 'object') {
        return res.status(400).json({error: "Stack informada deve ser do tipo objeto."})
    }
    for (const key in stack) {
        if (stack.hasOwnProperty(key) && typeof stack[key] !== 'string' && stack[key].length > 32) {
            return res.status(400).json({error: "Todos os elementos da stack devem ser tipo string e no máximo 32 caracteres"})
        }
    }    
    const stackJson = JSON.stringify(stack);

    // verificando se o apelido já está cadastrado
    if (await verifyDuplicateEntry('apelido', apelido) == true) {
        return res.status(422).json({error: "O apelido: "+ apelido +" já está sendo utilizado. Por favor informe outro apelido."})
    }

    // criando variável para retornar no header
    let headerLocation = '/pessoas/' + userUuid;
    try {
        let values = [userUuid, nome, apelido, nascimento, stackJson];
        await db.query('INSERT INTO pessoas(uuid, nome, apelido, nascimento, stack) values (?, ?, ?, ?, ?)', values)
        res.status(201)
            .set('Location', headerLocation)
            .json({
                success: true,
                message: 'The registraion was succefull',
          })        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: error.message,
        })
    }    
}

//@desc GET specific person
//@route GET /pessoas/:uuid
//@access public
const getPerson = async (req, res) => {
    
    try {
        const row = await db.query(`SELECT p.uuid, apelido, nome, DATE_FORMAT(nascimento, '%Y-%m-%d') nascimento,  stack FROM pessoas p WHERE p.uuid=?`, [req.params.uuid])

        if (row.length == 0) {
            res.status(404).json({error: "Not found"})
        } else {
            res.status(200).json({
                "uuid": row[0].uuid,
                "apelido": row[0].apelido,
                "nome": row[0].nome,
                "nascimento": row[0].nascimento,
                "stack": JSON.parse(row[0].stack)
            })            
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message,
        })
    }    
}


//@desc GET ALL person(people)-pessoas
//@route GET /pessoas?t=termo_de_busca
//@access public
const getPeople = async (req, res) => {

    if (req.query.t == null) {
        return res.status(400).json({ erro: 'O parâmetro t não foi informado. Parâmetro obrigatório.' });
    }
    
    try {
        const rows = await db.query(`SELECT p.uuid, p.apelido, p.nome, DATE_FORMAT(p.nascimento, '%Y-%m-%d') nascimento, p.stack
                                    FROM pessoas p 
                                    WHERE p.apelido LIKE '%${req.query.t}%'
                                    OR p.nome LIKE '%${req.query.t}%'
                                    OR LOWER(JSON_UNQUOTE(JSON_EXTRACT(p.stack, '$[*]'))) LIKE LOWER('%${req.query.t}%');`);                                    


        const rowsFormatted = rows.map(row => {
            // Converte a string JSON em um array usando JSON.parse
            const stackArray = JSON.parse(row.stack);
            
            // Atualiza a propriedade stack no objeto original
            row.stack = stackArray;
            
            return row;
        });
            
        res.status(200).json(rowsFormatted)


    } catch (error) {
        return res.status(500).json({
            error: error.message,
        })
    }    
}

//@desc Return numeros de pessoas cadastradas
//@route GET /contagem-pessoas
//@access public
const countPeople = async(req, res) => {
    try {
        const row = await db.query(`SELECT count(p.uuid) as contagemPessoas FROM pessoas p`)
        res.status(200).json({
            "contagemPessoas": row[0].contagemPessoas
        })            
    } catch (error) {
        return res.status(500).json({
            error: error.message,
        })
    }     
}

module.exports = {createPerson, getPerson, getPeople, countPeople}