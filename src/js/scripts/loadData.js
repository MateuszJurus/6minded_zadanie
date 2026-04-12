const config = {
    delay: 500,
    url: '../../pressRelease.json'
};

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function loadData() {
    await wait(config.delay);

    const response = await fetch(config.url);
    const pressReleases = await response.json();

    return pressReleases;
}
