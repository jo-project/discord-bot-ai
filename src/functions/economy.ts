import EconomySchema from '../models/economy.js'
export async function CheckBalance(user: string, guildId: string) {
    const data = await EconomySchema.findOne({ user: user, guild: guildId}) || await EconomySchema.create({ user: user, guild: guildId })

    if (!data.deposit) data.deposit = 0;
    if (!data.balance) data.balance = 0;
    data.save();

    return {
        balance: data.balance,
        deposit: data.deposit
    }
}

export async function GiveBalance(user: string, guildId: string, amount: number) {
    const data = await EconomySchema.findOne({ user: user, guild: guildId}) || await EconomySchema.create({ user: user, guild: guildId })

    if (!data.deposit) data.deposit = 0;
    if (!data.balance) data.balance = 0;

    data.balance += amount
    data.save();

    return true
}

export async function IfBankBalanceEnough(user: string, guildId: string, amount: number) {
    const data = await EconomySchema.findOne({ user: user, guild: guildId}) || await EconomySchema.create({ user: user, guild: guildId })

    if (!data.deposit) data.deposit = 0;
    if (!data.balance) data.balance = 0;

    if (data.balance >= amount) {
        return {
            status: true,
        }
    } else {
        return {
            status: false,
            description: `You only have $${data.balance} on your account`
        }
    }
}

export async function Withdraw(user: string, guildId: string, amount: number) {
    const data = await EconomySchema.findOne({ user: user, guild: guildId}) || await EconomySchema.create({ user: user, guild: guildId })

    if (!data.deposit) data.deposit = 0;
    if (!data.balance) data.balance = 0;

    data.balance -= amount
    data.deposit += amount

    return `You have successfully withdraw $${amount} from your account`
}

export async function IfBalanceEnough(user: string, guildId: string, amount: number) {
    const data = await EconomySchema.findOne({ user: user, guild: guildId}) || await EconomySchema.create({ user: user, guild: guildId })

    if (!data.deposit) data.deposit = 0;
    if (!data.balance) data.balance = 0;

    if (data.deposit + data.balance >= amount && data.balance < amount) {
        const neededMoney = Math.abs(amount - data.balance)
        return {
            status: false,
            description: `You don't have enough money on the bank, you need to deposit $${neededMoney} to the bank`
        }
    } else if (!(data.deposit + data.balance >= amount)) {
        const totalMoneyNow = data.deposit + data.balance
        const neededMoney = Math.abs(amount - totalMoneyNow)
        return {
            status: false,
            description: `You don't have enough money, you need $${neededMoney}`
        }
    } else if(data.balance >= amount) {
        return {
            status: true
        }
    }
}

export async function Pay(user: string, target: string, guildId: string, amount: number) {
    const UserData = await EconomySchema.findOne({ user: user, guild: guildId})
    const TargetData = await EconomySchema.findOne({ user: target, guild: guildId })

    if ((UserData && UserData.balance) && (TargetData && TargetData.balance)) {
        TargetData.balance += amount
        UserData.balance -= amount

        TargetData.save();
        UserData.save();

        return {
            status: true
        }
    } else if ((UserData && UserData.balance) && (!TargetData)) {
        return {
            status: false
        }
    }
}