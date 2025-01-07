import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { Product } from '../../types'

const productsFilePath = path.join(process.cwd(), 'app/data/products.json')

async function getProducts(): Promise<Product[]> {
  const productsData = await fs.readFile(productsFilePath, 'utf8')
  return JSON.parse(productsData)
}

async function saveProducts(products: Product[]): Promise<void> {
  await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2))
}

export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error reading products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newProduct: Omit<Product, 'id'> = await request.json()
    const products = await getProducts()
    const id = Math.max(...products.map(p => p.id), 0) + 1
    const productWithId = { id, ...newProduct }
    products.push(productWithId)
    await saveProducts(products)
    return NextResponse.json({ success: true, product: productWithId })
  } catch (error) {
    console.error('Error adding product:', error)
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updatedProduct: Product = await request.json()
    const products = await getProducts()
    const index = products.findIndex(p => p.id === updatedProduct.id)
    if (index !== -1) {
      products[index] = updatedProduct
      await saveProducts(products)
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id }: { id: number } = await request.json()
    let products = await getProducts()
    products = products.filter(p => p.id !== id)
    await saveProducts(products)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}


