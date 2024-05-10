import { useTypebot } from 'contexts/TypebotContext'
import { Block } from 'models'
import React from 'react'
import { AnswersCount } from 'services/analytics'
import { Edges } from './Edges'
import { BlockNode } from './Nodes/BlockNode'
import { useGraph } from 'contexts/GraphContext'

type Props = {
  answersCounts?: AnswersCount[]
  onUnlockProPlanClick?: () => void
  graphContainerRef: React.MutableRefObject<HTMLDivElement | null>
}
const MyComponent = ({
  answersCounts,
  onUnlockProPlanClick,
  graphContainerRef,
}: Props) => {
  const { typebot } = useTypebot()
  const { graphPosition } = useGraph()

  const visibleItems = typebot?.blocks.filter((item) =>
    isItemVisible(
      item,
      graphPosition,
      graphContainerRef.current?.offsetWidth,
      graphContainerRef.current?.offsetWidth
    )
  )
  console.log('visibleItems', visibleItems)
  return (
    <>
      <Edges
        edges={typebot?.edges ?? []}
        blocks={typebot?.blocks ?? []}
        answersCounts={answersCounts}
        onUnlockProPlanClick={onUnlockProPlanClick}
      />

      {visibleItems?.map((block) => {
        const blockIndex = typebot?.blocks.findIndex((b) => b.id === block.id)
        return (
          <BlockNode
            block={block}
            blockIndex={blockIndex ?? 0}
            key={block.id}
          />
        )
      })}

      {/* {typebot?.blocks.map((block, idx) => (
        <BlockNode block={block as Block} blockIndex={idx} key={block.id} />
      ))} */}
    </>
  )
}

// Performance hack, never rerender when graph (parent) is panned
const areEqual = () => true

export default React.memo(MyComponent, areEqual)

const isItemVisible = (
  item,
  graphPosition,
  containerWidth,
  containerHeight
) => {
  const { x, y, scale } = graphPosition
  const bufferX = 500
  const bufferY = 300
  // Transformar as coordenadas do item com base no nível de escala
  const scaledItemX = item.graphCoordinates.x * scale + x
  const scaledItemY = item.graphCoordinates.y * scale + y

  const itemWidth = (313 + bufferX) * scale // Considerando a largura do item
  const itemHeight = (500 + bufferY) * scale // Considerando a altura do item

  // Verifique se o item ainda tem alguma parte visível na tela
  const isHorizontallyVisible =
    scaledItemX + itemWidth > 0 && scaledItemX < containerWidth

  const isVerticallyVisible =
    scaledItemY + itemHeight > 0 && scaledItemY < containerHeight

  // O item é visível se ainda estiver parcialmente dentro da área visível
  return isHorizontallyVisible && isVerticallyVisible
}
