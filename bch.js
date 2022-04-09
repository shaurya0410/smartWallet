"use strict";
console.log('bch');
//mainnet - old beach trumpet dynamic fatigue chunk audit spatial bonus unfair practice ride
//testnet -polar twist romance people answer topic myth vault own win steel lounge
async function start() {
    if (localStorage.getItem("wallet") != null) {
        const mnemonic = JSON.parse(localStorage.getItem("wallet")).mnemonic;
        const wallet = await TestNetSmartBchWallet.fromSeed(mnemonic);
        showData(wallet);
        console.log(wallet);
        // myWallet(wallet);
        // qr(wallet);
        document.getElementById("mainBox").style.display = "none";
    } else {
        document.getElementById("myWalletBox").style.display = "none";
    }
}

async function newWallet() {
    localStorage.clear("wallet");
    const wallet = await TestNetSmartBchWallet.newRandom();
    localStorage.setItem("wallet", JSON.stringify(wallet));
    console.log(wallet);
    showData(wallet);
    document.getElementById("mainBox").style.display = "none";
    document.getElementById("myWalletBox").style.display = "flex";
}

async function showData(wallet) {
    // console.log(wallet);
    const balance = await wallet.getBalance();
    transaction(wallet);
    // console.log(balance);
    document.getElementById("walletBalance").innerText = `${balance.bch.toFixed(8)} BCH`;

    document.getElementById("walletAddress").value = `${wallet.address}`;

    document.querySelector('#deposit').src = wallet.getDepositQr().src;
}

async function importWallet() {
    localStorage.clear("wallet");
    let mnemonic = document.getElementById("seed").value;
    const wallet = await TestNetSmartBchWallet.fromSeed(mnemonic);
    localStorage.setItem("wallet", JSON.stringify(wallet));
    showData(wallet);
    console.log(wallet);
    document.getElementById("mainBox").style.display = "none";
    document.getElementById("myWalletBox").style.display = "flex";
}

function closeSend() {
    document.getElementById("address").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("myWalletBox").style.display = "flex";
    document.getElementById("sendBox").style.display = "none";
}

function openSend() {
    document.getElementById("sendBox").style.display = "flex";
    document.getElementById("myWalletBox").style.display = "none";
}

function closeReceive() {
    document.getElementById("myWalletBox").style.display = "flex";
    document.getElementById("receiveBox").style.display = "none";
}

function openReceive() {
    document.getElementById("receiveBox").style.display = "flex";
    document.getElementById("myWalletBox").style.display = "none";
}

function copyAddress() {
    let input = document.getElementById("walletAddress");
    console.log(input);
    // input.focus();
    input.select();
    navigator.clipboard.writeText(input.value);
}

async function withdraw() {
    const seller = String(document.getElementById("address").value);
    const amount = Number(document.getElementById("amount").value);

    if (seller != "" && amount != "") {
        const mnemonic = JSON.parse(localStorage.getItem("wallet")).mnemonic;
        const wallet = await TestNetSmartBchWallet.fromSeed(mnemonic);
        // console.log(wallet);
        const balance = await wallet.getBalance();
        const overrides = {gasPrice: 0.2,gasLimit:26038}
        const txData = await wallet.send([[seller, amount, 'bch', overrides]]);
        console.log(txData);

        localStorage.setItem("txData", JSON.stringify(txData));
        txFees(balance,wallet,seller,txData,amount);
        showData(wallet);

    } else {
        console.log('Invalid Data');
    }
}

//withdraw section -->

// function test() {
//     let txData =JSON.parse(localStorage.getItem("txData"));
//     console.log(txData[0]);
//     console.log(txData[0].txId);
//     console.log(txData[0].balance["bch"]);
//     console.log(txData[0].explorerUrl);
// }

// test();

function toggleMenu() {
    if (document.getElementById("menuBox").style.display == "none" || document.getElementById("menuBox").style.display == "") {
        document.getElementById("menuBox").style.display = "flex";

    } else {
        document.getElementById("menuBox").style.display = "none";
    }
}

async function maxAmount() {
    const mnemonic = JSON.parse(localStorage.getItem("wallet")).mnemonic;
    const wallet = await TestNetSmartBchWallet.fromSeed(mnemonic);
    const max = await wallet.getMaxAmountToSend();
    console.log(max);
    const maxbch = max["bch"];
    document.getElementById("amount").value =`${maxbch}`;
}

function closeAccount() {
    document.getElementById("myWalletBox").style.display = "flex";
    document.getElementById("accountBox").style.display = "none";
}

function openAccount() {
    document.getElementById("accountBox").style.display = "flex";
    document.getElementById("myWalletBox").style.display = "none";
    document.getElementById("menuBox").style.display = "none";
}

function transaction(wallet) {
    // let address = JSON.parse(localStorage.getItem("wallet")).address;
    let address = wallet.address;
    document.getElementById("txLink").innerHTML = `<a href=https://www.smartscan.cash/address/${address} target="_blank">Transaction</a>`;
    document.getElementById("menuBox").style.display = "none";
}

async function txFees(balance,wallet,seller,txData,amount) {
    console.log(balance.bch);
    const totalSend = balance.bch - txData[0].balance["bch"];
    console.log(`TotalSend: ${totalSend.toFixed(8)}`);
    const fees = totalSend - amount;
    console.log(`Fees: ${fees.toFixed(8)}`);
    console.log(`From:${wallet.address}`);
    console.log(`To: ${seller}`);
    console.log(`Amount: ${amount.toFixed(8)}`);
    console.log(`TxId: ${txData[0].txId}`);
    console.log(`BalanceLeft: ${txData[0].balance["bch"].toFixed(8)}`);
}