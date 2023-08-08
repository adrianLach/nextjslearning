/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/u/*',
            },
        ],
    },
}

// eslint-disable-next-line no-undef
module.exports = nextConfig
