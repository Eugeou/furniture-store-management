export const ParseJSON = (token: string) => {
    if (!token) {
        throw new Error('No access token found');
    }

    const parseToken = JSON.parse(token);
    return parseToken;
}

