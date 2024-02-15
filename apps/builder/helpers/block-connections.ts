import { Typebot, Block } from 'models'

export const updateBlocksHasConnections = ({
  blocks,
  edges,
}: Typebot): Block[] => {
  return blocks.map((block) => {
    const hasConnection = !!edges.find(
      (edge) => edge.from.blockId === block.id || edge.to.blockId === block.id
    )

    block.hasConnection = hasConnection

    return block
  })
}
