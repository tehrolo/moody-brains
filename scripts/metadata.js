import { calculateTokenId } from "./mergeimage.js";
import fs from "fs";

export function genMetadatasForCollection(collectionInfo, imagePath) {
  const collectionId = collectionInfo.id;
  const baseLevelsLen = collectionInfo.baseLevels.length;
  const relativeLevelsLen = collectionInfo.relativeLevels.length;

  const baseDir = process.cwd() + "/collections/" + collectionInfo.name + "/metadatas/"
  for (const tokenInfo of collectionInfo.tokens) {
    for (let i = 0; i < baseLevelsLen; i++) {
      for (let j = 0; j < relativeLevelsLen; j++) {
        const imageUrl = imagePath + tokenInfo.name + "_" + i + "_" + j + ".png";
        const metadata = {
          "name": `Loophead ${tokenInfo.name}`,
          "image": imageUrl,
          "description": "",
          "external_uri": "https://loopring.io",
          "attributes": {
            "collection": "MoodyBrains#" + collectionId,
            "series": "MoodyBrains Loopheads",
            "standard": "ERC1155",
            "contract_impl": "${the implementation contract address on mainnet}",
            "contract_codebase": "https://github.com/Loopring/moody-brains",
            "counterfactual": false,
            "minted_by": "Loopring Technology Limited",
            "minted_on": "Loopring zkRollupu Layer2",
            "minted_at": "2021-12-23",
            "price_source_pool": "${uniswapPool}", //合约用的uniswapPool参数
            "price_source_pair": "${LRC/ETH}", // uniswapPool对应的交易对
            "price_levels": collectionInfo.baseLevels, // 合约priceLevels的数组
            "price_level": i,
            "price_relative_levels": collectionInfo.relativeLevels, // relativeLevels
            "price_relative_level": j,
            "image_width": "120px",
            "image_height": "120px",
            "image_weight": tokenInfo.imageSize, //文件大小
            "designer": "Zhangchong <zhangchong@loopring.io>",
            "gender": `${tokenInfo.gender}`,
            "cache_expiry_seconds": 300
          }
        }

        console.log(collectionId, tokenInfo.id);
        const tokenId = calculateTokenId(collectionId, tokenInfo.id);
        console.log("tokenId:", tokenId);
        const metadataDir = baseDir + tokenId + "/" + i + "_" + j + "/";
        fs.mkdirSync(metadataDir, { recursive: true });
        fs.writeFileSync(
          metadataDir + "metadata.json",
          JSON.stringify(metadata, undefined, 2)
        );

      }
    }
  }

  return baseDir;
}
